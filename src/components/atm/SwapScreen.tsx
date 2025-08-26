"use client";

import { useState, useMemo, useCallback } from "react";
import { formatUnits, parseUnits } from "viem";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useSwap } from "@/hooks/useSwap";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import type { SupportedNetwork } from "@/constants/tokens";
import { getTokenDecimals, getTokenSymbol } from "@/utils/tokens";
import { ATMScreen } from "./ATMContainer";
import { SwapInput } from "./SwapInput";
import { TransactionReceiptModal } from "./TransactionReceiptModal";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { Button, CTAButton } from "@/components/ui";
import Image from "next/image";

interface SwapScreenProps {
  onNavigate: (screen: ATMScreen) => void;
}

export function SwapScreen({ onNavigate }: SwapScreenProps) {
  const evmAddress = useEvmAddress();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [selectingToToken, setSelectingToToken] = useState(false);

  const {
    // State
    fromToken,
    toToken,
    fromAmount,
    network,
    setFromToken,
    setToToken,
    setFromAmount,
    setNetwork,

    // Price data
    priceData,
    isPriceLoading,
    priceError,

    // Quote creation
    createQuote,
    isQuoteLoading,
    quoteError,

    // Execution
    executeSwap,
    isExecutionLoading,
    executionError,

    // Utils
    resetSwap,
  } = useSwap();

  // Get tokens for current network
  const networkTokens = useMemo(
    () =>
      Object.values(
        SUPPORTED_NETWORKS[network as keyof typeof SUPPORTED_NETWORKS] || {},
      ),
    [network],
  );
  const { data: balances, totalUsdBalance } = useTokenBalances(
    network as SupportedNetwork,
    networkTokens,
  );

  // Get balance for from token
  const fromTokenBalance = useMemo(() => {
    if (!fromToken || !balances) return null;
    return balances.find(
      (balance) =>
        balance.token.address.toLowerCase() === fromToken.address.toLowerCase(),
    );
  }, [fromToken, balances]);

  // Handle max button click
  const handleMaxClick = useCallback(() => {
    if (!fromToken || !fromTokenBalance) return;

    const decimals = getTokenDecimals(fromToken.address, network);
    const maxAmount = formatUnits(BigInt(fromTokenBalance.balance), decimals);
    setFromAmount(maxAmount);
  }, [fromToken, fromTokenBalance, network, setFromAmount]);

  // Handle token swap (flip from/to)
  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount("");
  }, [fromToken, toToken, setFromToken, setToToken, setFromAmount]);

  // Handle swap execution
  const handleSwap = async () => {
    if (!priceData || !fromToken || !toToken || !evmAddress) return;

    try {
      const swapQuote = await createQuote({
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAmount: parseUnits(fromAmount, fromToken.decimals),
        network,
        taker: evmAddress,
        slippageBps: 100, // 1% slippage
      });

      if (swapQuote) {
        // Show receipt modal immediately
        setShowReceiptModal(true);

        const result = await executeSwap({
          swapQuote,
          fromTokenAddress: fromToken.address,
          network,
        });

        // Set transaction hash if available
        if (result?.transactionHash) {
          setTransactionHash(result.transactionHash);
        }

        // Reset only the input amounts, keep tokens selected
        setFromAmount("");
      }
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  // Check if swap is ready
  const isSwapReady =
    fromToken && toToken && fromAmount && priceData && !priceError;

  // Calculate if user has sufficient balance
  const hasSufficientBalance = useMemo(() => {
    if (!fromToken || !fromTokenBalance || !fromAmount) return true;

    // Validate and normalize the amount
    const numericAmount = parseFloat(fromAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) return true;

    const decimals = getTokenDecimals(fromToken.address, network);
    const requiredAmount = parseUnits(
      numericAmount.toString(),
      decimals,
    );
    return BigInt(fromTokenBalance.balance) >= requiredAmount;
  }, [fromToken, fromTokenBalance, fromAmount, network]);

  return (
    <div className="flex flex-col w-full max-w-[390px] mx-auto px-[15px] py-10 md:py-[105px] min-h-screen">
      {/* Main content card */}
      <div
        className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
        style={{
          background: "linear-gradient(103.02deg, #1E1E1E 0%, #3D3C3C 101.44%)",
        }}
      >
        <div
          className="w-full h-full rounded-[20px] relative"
          style={{
            background:
              "radial-gradient(50% 294.9% at 50% 50%, #09140E 0%, #050A07 100%)",
            boxShadow: "0px 0px 14px 0px #00000026 inset",
          }}
        >
          <div className="relative z-10 flex flex-col pt-[18px] pb-6 px-6 h-full">
            {/* Header with back button and address */}
            <div className="flex items-center justify-between w-full mb-[18px]">
              <button
                onClick={() => onNavigate("home")}
                className="cursor-pointer font-semibold text-xs flex gap-x-1"
              >
                <Image
                  width={12}
                  height={12}
                  src={"/back-arrow.svg"}
                  alt="back"
                />{" "}
                <span className="text-white/30">Go back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="text-[#2ac876] font-semibold text-xs">
                  {evmAddress
                    ? `${evmAddress.slice(0, 6)}..${evmAddress.slice(-4)}`
                    : "Not Connected"}
                </div>
                <button className="text-[#2ac876] cursor-pointer">
                  <Image src="/copy.svg" alt="Copy" width={12} height={12} />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 mb-6"></div>

            {!fromToken || selectingToToken ? (
              /* Token selection interface */
              <TokenSelectorScreen
                onNavigate={onNavigate}
                onTokenSelect={(token) => {
                  if (selectingToToken) {
                    setToToken(token);
                    setSelectingToToken(false);
                  } else {
                    setFromToken(token);
                  }
                }}
                excludeToken={selectingToToken ? fromToken : null}
                network={network as SupportedNetwork}
                title={selectingToToken ? "Select Token to Buy" : "Select Token to Sell"}
                balances={balances}
                totalUsdBalance={totalUsdBalance}
              />
            ) : (
              /* Swap interface */
              <div className="flex flex-col h-full">
                {/* You're trading section */}
                <div className="mb-6">
                  <p className="text-white/30 text-sm mb-3">You're trading</p>
                  <div className="flex items-center gap-3 w-full justify-between">
                    {/* From token pill */}
                    <button
                      onClick={() => {
                        setFromToken(null);
                        setToToken(null);
                        setSelectingToToken(false);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-[#2BC876] rounded-full hover:bg-[#25b369] transition-colors"
                    >
                      <Image
                        src={fromToken.logoUrl!}
                        alt={fromToken.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-black font-medium text-sm font-pixelify">
                        {fromToken.symbol}
                      </span>
                    </button>

                    {/* Exchange icon */}
                    <Image
                      src="/exchange.svg"
                      alt="Exchange"
                      width={16}
                      height={16}
                      className="cursor-pointer"
                      onClick={handleSwapTokens}
                    />

                    {/* To token pill */}
                    {toToken ? (
                      <button
                        onClick={() => setSelectingToToken(true)}
                        className="flex items-center gap-2 px-3 py-2 border border-[#2BC876] rounded-full hover:bg-[#2BC876]/10 transition-colors"
                      >
                        <Image
                          src={toToken.logoUrl!}
                          alt={toToken.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="text-[#2BC876] font-medium text-sm">
                          {toToken.symbol}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectingToToken(true)}
                        className="relative px-3 py-2 rounded-full text-[#2BC876] font-medium text-sm flex items-center gap-1 font-pixelify bg-[#2BC876]/20"
                      >
                        <span>Select token</span>
                        <Image
                          src="/chevron-down.svg"
                          width={14}
                          height={14}
                          alt="down"
                        />

                        {/* Border overlay */}
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{
                            border: "1px dashed transparent",
                            borderRadius: "9999px",
                            background:
                              "repeating-linear-gradient(90deg, #2BC876 0 12px, transparent 12px 24px)",
                            WebkitMask:
                              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                            padding: "1px",
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Amount input */}
                <div className="flex-1 flex items-center justify-center">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-[#2BC876] w-full text-center bg-transparent border-none outline-none text-[56px] leading-[50px] tracking-[2%] font-pixelify font-normal placeholder-[#2BC876]/40"
                  />
                </div>

                {/* Bottom info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 uppercase">Slippage</span>
                    <span className="text-white">1%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 uppercase">
                      Transaction fee
                    </span>
                    <span className="text-white">
                      {priceData?.fees ? (
                        <>
                          {priceData.fees.protocolFee && (
                            <>
                              {formatUnits(
                                BigInt(
                                  priceData.fees.protocolFee.amount || "0",
                                ),
                                getTokenDecimals(
                                  priceData.fees.protocolFee.token,
                                  network,
                                ),
                              )}{" "}
                              {getTokenSymbol(
                                priceData.fees.protocolFee.token,
                                network,
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        "0.00"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 uppercase">Network</span>
                    <span className="text-[#2ac876]">Base</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <CTAButton
        onClick={() => {
          if (!fromToken || selectingToToken) {
            // Token selection is handled by the token list interface
            return;
          } else if (!toToken) {
            // Open to token selector
            setSelectingToToken(true);
          } else if (priceData) {
            // Execute swap
            handleSwap();
          }
        }}
        text={
          !fromToken
            ? "Select Token"
            : selectingToToken
              ? "Select Token"
              : !toToken
                ? "Select Token"
                : isPriceLoading
                  ? "Getting Quote..."
                  : !hasSufficientBalance
                    ? "Insufficient Balance"
                    : !isSwapReady
                      ? "Enter Amount"
                      : "Trade"
        }
        disabled={
          isPriceLoading ||
          (fromToken && toToken && !hasSufficientBalance) ||
          false
        }
        className="mt-[10px]"
      />

      {/* Bottom section */}
      <div className="relative">
        <div className="flex items-center justify-center mt-[20px] mb-2">
          <div className="text-white font-medium text-[9px] text-center tracking-[2.75px] leading-[15px] mix-blend-color-dodge opacity-32">
            COLLECT YOUR CRYPTO
          </div>
        </div>

        {/* Bottom card */}
        <div className="w-full flex flex-col items-center justify-center gap-2.5 p-2 rounded-lg border-[0.7px] border-white/20">
          <div
            className="w-full h-[26px] rounded-[3px] p-px relative"
            style={{
              background:
                "linear-gradient(103.02deg, #1E1E1E 0%, #3D3C3C 101.44%)",
            }}
          >
            <div
              className="w-full h-full rounded-[3px] relative"
              style={{
                background:
                  "linear-gradient(104.62deg, #1A1A1A 0.45%, #090909 100%)",
                boxShadow: "0px 0px 18px 0px #000000E5 inset",
              }}
            >
              <div className="absolute w-px h-[11px] -top-3 left-1/2 transform -translate-x-1/2 mix-blend-color-dodge bg-white/20"></div>
            </div>
          </div>
        </div>

        <TransactionReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            setTransactionHash(undefined);
          }}
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={
            priceData
              ? formatUnits(BigInt(priceData.toAmount), toToken?.decimals || 18)
              : "0"
          }
          network={network as SupportedNetwork}
          transactionHash={transactionHash}
          isExecuting={isExecutionLoading}
        />
      </div>
    </div>
  );
}
