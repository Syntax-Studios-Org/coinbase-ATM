import { useState, useCallback, useEffect } from "react";
import {
  useEvmAddress,
  useSendEvmTransaction,
  useSignEvmTypedData,
} from "@coinbase/cdp-hooks";
import {
  concat,
  numberToHex,
  size,
  type Hex,
  encodeFunctionData,
  erc20Abi,
  parseUnits,
} from "viem";
import { SwapService } from "@/services/swap.service";
import { SWAP_CONFIG } from "@/constants/config";
import {
  createBasePublicClient,
  waitForTransactionConfirmation,
} from "@/lib/transaction-helper";
import type {
  SwapParams,
  Token,
  SwapQuote,
  SwapQuoteResponse,
  AllowanceIssue,
  Permit2Data,
} from "@/types/swap";

interface SwapExecutionParams {
  swapQuote: SwapQuoteResponse;
  fromTokenAddress: string;
  network: string;
}

const getChainId = (network: string): number => {
  switch (network.toLowerCase()) {
    case "base":
      return 8453;
    default:
      return 8453;
  }
};

/**
 * useSwap hook that handles all swap-related functionality:
 * - State management for swap form
 * - Price fetching with auto-refresh
 * - Quote creation
 * - Swap execution with approvals and permits
 */
export const useSwap = () => {
  const evmAddress = useEvmAddress();
  const sendTransaction = useSendEvmTransaction();
  const signTypedData = useSignEvmTypedData();
  const publicClient = createBasePublicClient();

  // State management
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [network, setNetwork] = useState<string>("base");

  // Price fetching state
  const [priceData, setPriceData] = useState<SwapQuote | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<Error | null>(null);

  // Quote creation state
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<Error | null>(null);

  // Execution state
  const [isExecutionLoading, setIsExecutionLoading] = useState(false);
  const [executionError, setExecutionError] = useState<Error | null>(null);

  // State management functions
  const swapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(""); // Clear amount when swapping
  }, [fromToken, toToken]);

  const resetSwap = useCallback(() => {
    setFromToken(null);
    setToToken(null);
    setFromAmount("");
  }, []);

  // Price fetching functionality
  const fetchPrice = useCallback(
    async (
      fromTokenParam: Token | null,
      toTokenParam: Token | null,
      fromAmountParam: bigint,
      networkParam: string,
      enabled: boolean = true,
    ) => {
      if (
        !enabled ||
        !fromTokenParam ||
        !toTokenParam ||
        !evmAddress ||
        fromAmountParam === BigInt(0)
      ) {
        setPriceData(null);
        return;
      }

      setIsPriceLoading(true);
      setPriceError(null);

      try {
        const params: SwapParams = {
          fromToken: fromTokenParam.address,
          toToken: toTokenParam.address,
          fromAmount: fromAmountParam,
          network: networkParam,
          taker: evmAddress,
        };

        const quote = await SwapService.getSwapPrice(params);
        if (quote) {
          quote.fromToken = fromTokenParam;
          quote.toToken = toTokenParam;
        }
        setPriceData(quote);
      } catch (err) {
        setPriceError(
          err instanceof Error ? err : new Error("Failed to fetch price"),
        );
        setPriceData(null);
      } finally {
        setIsPriceLoading(false);
      }
    },
    [evmAddress],
  );

  // Auto-refresh price data
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) return;

    // Convert decimal amount to BigInt using token decimals
    let fromAmountBigInt: bigint;
    try {
      if (!fromAmount || fromAmount === "" || isNaN(Number(fromAmount))) {
        fromAmountBigInt = BigInt(0);
      } else {
        // Use parseUnits to convert decimal string to BigInt with proper decimals
        fromAmountBigInt = parseUnits(fromAmount, fromToken.decimals);
      }
    } catch (error) {
      console.error("Error parsing amount:", error);
      fromAmountBigInt = BigInt(0);
    }

    if (fromAmountBigInt === BigInt(0)) return;

    fetchPrice(fromToken, toToken, fromAmountBigInt, network, true);

    // Auto-refresh for fresh prices
    const interval = setInterval(() => {
      fetchPrice(fromToken, toToken, fromAmountBigInt, network, true);
    }, SWAP_CONFIG.PRICE_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchPrice, fromToken, toToken, fromAmount, network]);

  // Quote creation functionality
  const createQuote = useCallback(
    async (
      params: SwapParams & { slippageBps?: number },
    ): Promise<SwapQuoteResponse> => {
      if (!evmAddress) {
        throw new Error("No wallet address available");
      }

      setIsQuoteLoading(true);
      setQuoteError(null);

      try {
        const result = await SwapService.createSwapQuote({
          ...params,
          taker: evmAddress,
        });
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to create swap quote");
        setQuoteError(error);
        throw error;
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [evmAddress],
  );

  // Token approval functionality
  const handleTokenApproval = useCallback(
    async (
      allowanceIssue: AllowanceIssue,
      fromTokenAddress: string,
      networkParam: string,
      requiredAllowance: bigint,
    ) => {
      const currentAllowance = BigInt(allowanceIssue.currentAllowance);
      const spender = allowanceIssue.spender;

      if (currentAllowance >= requiredAllowance) return;

      console.log(
        "Sending ERC-20 approval for",
        requiredAllowance.toString(),
        "tokens...",
      );

      const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender as `0x${string}`, requiredAllowance],
      });

      // Simulate the transaction to estimate gas
      let estimatedGas: bigint;
      try {
        estimatedGas = await publicClient.estimateGas({
          account: evmAddress as `0x${string}`,
          to: fromTokenAddress as `0x${string}`,
          data: approveData,
          value: 0n,
        });
        // Add 20% buffer to the estimated gas
        estimatedGas = (estimatedGas * 120n) / 100n;
      } catch (error) {
        console.warn("Gas estimation failed, using fallback:", error);
        estimatedGas = 100000n; // Fallback gas limit
      }

      // Get current gas prices from the network
      let maxFeePerGas: bigint;
      let maxPriorityFeePerGas: bigint;
      try {
        const feeData = await publicClient.estimateFeesPerGas();
        maxFeePerGas = feeData.maxFeePerGas || 10000000n;
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || 1000000n;
      } catch (error) {
        console.warn("Fee estimation failed, using fallback:", error);
        maxFeePerGas = 10000000n;
        maxPriorityFeePerGas = 1000000n;
      }

      const approvalTx = await sendTransaction({
        evmAccount: evmAddress!,
        network: networkParam as any,
        transaction: {
          to: fromTokenAddress as `0x${string}`,
          data: approveData,
          value: 0n,
          gas: estimatedGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          chainId: getChainId(networkParam),
          type: "eip1559" as const,
        },
      });

      await waitForTransactionConfirmation(
        publicClient,
        approvalTx.transactionHash,
        "ERC-20 approval",
      );
    },
    [evmAddress, sendTransaction, publicClient],
  );

  // Permit2 signing functionality
  const signPermit2Message = useCallback(
    async (permit2Data: Permit2Data): Promise<Hex> => {
      console.log("Signing Permit2 message...");

      const signResult = await signTypedData({
        evmAccount: evmAddress!,
        typedData: {
          domain: permit2Data.eip712.domain,
          types: permit2Data.eip712.types,
          primaryType: permit2Data.eip712.primaryType,
          message: permit2Data.eip712.message,
        },
      });

      const signature = signResult.signature as Hex;
      const signatureLength = numberToHex(size(signature), {
        signed: false,
        size: 32,
      });

      return concat([signatureLength, signature]);
    },
    [evmAddress, signTypedData],
  );

  // Swap execution functionality
  const executeSwap = useCallback(
    async ({
      swapQuote,
      fromTokenAddress,
      network: networkParam,
    }: SwapExecutionParams): Promise<{ transactionHash: string }> => {
      if (!evmAddress) {
        throw new Error("Wallet not connected");
      }

      setIsExecutionLoading(true);
      setExecutionError(null);

      try {
        if (swapQuote.issues?.allowance) {
          await handleTokenApproval(
            swapQuote.issues.allowance,
            fromTokenAddress,
            networkParam,
            BigInt(swapQuote.fromAmount),
          );
        }

        let txData = swapQuote.transaction.data as Hex;
        if (swapQuote.permit2?.eip712) {
          const permitSignature = await signPermit2Message(swapQuote.permit2);
          txData = concat([txData, permitSignature]);
        }

        console.log("Executing swap...");
        const swapTx = await sendTransaction({
          evmAccount: evmAddress,
          network: networkParam as any,
          transaction: {
            to: swapQuote.transaction.to as `0x${string}`,
            data: txData,
            value: BigInt(swapQuote.transaction.value),
            gas: swapQuote.transaction.gas
              ? BigInt(swapQuote.transaction.gas)
              : 500000n,
            maxFeePerGas: swapQuote.transaction.gasPrice
              ? BigInt(swapQuote.transaction.gasPrice)
              : 10000000n,
            maxPriorityFeePerGas: swapQuote.transaction.gasPrice
              ? BigInt(
                  Math.min(
                    Math.floor(Number(swapQuote.transaction.gasPrice) * 0.1),
                    1000000000,
                  ),
                )
              : 1000000000n,
            chainId: getChainId(networkParam),
            type: "eip1559" as const,
          },
        });

        await waitForTransactionConfirmation(
          publicClient,
          swapTx.transactionHash,
          "Swap transaction",
        );

        const result = { transactionHash: swapTx.transactionHash };
        console.log("Swap completed successfully:", result.transactionHash);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Swap execution failed");
        setExecutionError(error);
        console.error("Swap failed:", error);
        throw error;
      } finally {
        setIsExecutionLoading(false);
      }
    },
    [
      evmAddress,
      sendTransaction,
      signTypedData,
      publicClient,
      handleTokenApproval,
      signPermit2Message,
    ],
  );

  return {
    // State
    fromToken,
    toToken,
    fromAmount,
    network,
    setFromToken,
    setToToken,
    setFromAmount,
    setNetwork,
    swapTokens,
    resetSwap,

    // Price data
    priceData,
    isPriceLoading,
    priceError,
    refetchPrice: () => {
      if (fromToken && toToken && fromAmount) {
        // Convert decimal amount to BigInt using token decimals
        let fromAmountBigInt: bigint;
        try {
          if (!fromAmount || fromAmount === "" || isNaN(Number(fromAmount))) {
            fromAmountBigInt = BigInt(0);
          } else {
            fromAmountBigInt = parseUnits(fromAmount, fromToken.decimals);
          }
        } catch (error) {
          console.error("Error parsing amount in refetchPrice:", error);
          fromAmountBigInt = BigInt(0);
        }

        if (fromAmountBigInt > BigInt(0)) {
          fetchPrice(fromToken, toToken, fromAmountBigInt, network, true);
        }
      }
    },

    // Quote creation
    createQuote,
    isQuoteLoading,
    quoteError,

    // Execution
    executeSwap,
    isExecutionLoading,
    executionError,
  };
};
