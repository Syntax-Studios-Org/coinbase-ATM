"use client";

import { useState, useMemo } from "react";
import { useEvmAddress, useSendEvmTransaction } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { UserHeader } from "./UserHeader";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { ATMButton } from "@/components/ui/ATMButton";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import type { Token } from "@/types/swap";
import Image from "next/image";
import { formatUnits, parseUnits, encodeFunctionData, erc20Abi } from "viem";

interface SendCryptoScreenProps {
  onNavigate: () => void;
  onSendComplete?: (transactionHash: string, tokenData?: {
    fromToken: any;
    toToken: any;
    fromAmount: string;
    toAmount: string;
  }) => void;
  onShowPrivateKey?: () => void;
}

type SendStep = "address" | "token" | "amount";

export function SendCryptoScreen({
  onNavigate,
  onSendComplete,
  onShowPrivateKey,
}: SendCryptoScreenProps) {
  const [currentStep, setCurrentStep] = useState<SendStep>("address");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  const evmAddress = useEvmAddress();
  const sendTransaction = useSendEvmTransaction();
  const { getVar } = useThemeStyles();

  // Get all tokens from all networks for balance calculation
  const allTokens = useMemo(
    () =>
      Object.values(SUPPORTED_NETWORKS).flatMap((network) =>
        Object.values(network),
      ),
    [],
  );
  const { data: balances, totalUsdBalance } = useTokenBalances(
    "base",
    allTokens,
  );

  // Get selected token balance
  const selectedTokenBalance = useMemo(() => {
    if (!selectedToken || !balances) return null;
    return balances.find(
      (b) =>
        b.token.address.toLowerCase() === selectedToken.address.toLowerCase(),
    );
  }, [selectedToken, balances]);

  const formattedBalance = selectedTokenBalance
    ? parseFloat(
        formatUnits(
          BigInt(selectedTokenBalance.balance),
          selectedToken!.decimals,
        ),
      )
        .toFixed(8)
        .replace(/\.?0+$/, "")
    : "0";

  const usdValue = useMemo(() => {
    if (!amount || !selectedTokenBalance || !selectedTokenBalance.usdValue)
      return 0;
    const tokenAmount = parseFloat(amount);
    const tokenBalance = parseFloat(
      formatUnits(
        BigInt(selectedTokenBalance.balance),
        selectedToken!.decimals,
      ),
    );
    const usdPerToken = selectedTokenBalance.usdValue / tokenBalance;
    return tokenAmount * usdPerToken;
  }, [amount, selectedTokenBalance, selectedToken]);

  const handleAddressSubmit = () => {
    if (recipientAddress.trim()) {
      setCurrentStep("token");
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setCurrentStep("amount");
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleUseMax = () => {
    if (selectedTokenBalance && selectedToken) {
      const maxAmount = formatUnits(
        BigInt(selectedTokenBalance.balance),
        selectedToken.decimals,
      );
      setAmount(maxAmount);
    }
  };

  const handleSend = async () => {
    if (!selectedToken || !amount || !recipientAddress || !evmAddress) return;

    setIsSending(true);
    try {
      const amountInWei = parseUnits(amount, selectedToken.decimals);
      let txnHash = "";

      // For ETH transfers
      if (selectedToken.symbol === "ETH") {
        const { transactionHash } = await sendTransaction({
          evmAccount: evmAddress!,
          network: "base" as any,
          transaction: {
            to: recipientAddress as `0x${string}`,
            value: amountInWei,
            gas: 21000n,
            maxFeePerGas: 10000000n,
            maxPriorityFeePerGas: 1000000n,
            chainId: 8453,
            type: "eip1559" as const,
          },
        });
        txnHash = transactionHash;
      } else {
        // For ERC20 token transfers - encode transfer function call
        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipientAddress as `0x${string}`, amountInWei],
        });

        const { transactionHash } = await sendTransaction({
          evmAccount: evmAddress!,
          network: "base" as any,
          transaction: {
            to: selectedToken.address as `0x${string}`,
            data: transferData,
            value: 0n,
            gas: 100000n,
            maxFeePerGas: 10000000n,
            maxPriorityFeePerGas: 1000000n,
            chainId: 8453,
            type: "eip1559" as const,
          },
        });
        txnHash = transactionHash;
      }

      const tokenData = {
        fromToken: selectedToken,
        toToken: null, // No toToken for send transactions
        fromAmount: amount,
        toAmount: ""
      };

      if (onSendComplete) {
        onSendComplete(txnHash, tokenData);
      }

    } catch (error) {
      console.error("Failed to send transaction:", error);
    } finally {
      setIsSending(false);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Step 1: Address input
  if (currentStep === "address") {
    return (
      <div className="flex flex-col items-center h-full w-full gap-3">
        <UserHeader
          address={evmAddress}
          isSignedIn={!!evmAddress}
          showGoBack={true}
          onGoBack={onNavigate}
          onShowPrivateKey={onShowPrivateKey}
        />

        <div className="flex items-center justify-between w-full mb-6">
          <p
            className="font-pixelify text-2xl"
            style={{ color: getVar("primary") }}
          >
            Send
          </p>
          <Image src="/thumb.svg" alt="Thumb" width={24} height={24} />
        </div>
        <div className="flex-1 pt-10">
          <div className="flex flex-col items-center w-full">
            <p className="text-sm" style={{ color: getVar("textMuted") }}>
              Sending to
            </p>
            <div className="flex-1 flex items-center justify-center">
              <input
                type="text"
                placeholder="0xab....."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="text-[#2BC876] w-full text-center bg-transparent border-none outline-none text-[56px] leading-[50px] tracking-[2%] font-pixelify font-normal placeholder-[#2BC876]/40"
              />
            </div>
          </div>
        </div>

        {/* Send button */}
        <div className="w-full">
          <ATMButton
            onClick={handleAddressSubmit}
            disabled={!recipientAddress.trim()}
          >
            Send
          </ATMButton>
        </div>
      </div>
    );
  }

  // Step 2: Token selection
  if (currentStep === "token") {
    return (
      <TokenSelectorScreen
        onNavigate={onNavigate}
        onTokenSelect={handleTokenSelect}
        balances={balances}
        totalUsdBalance={totalUsdBalance}
        text="Select a token to send."
        icon="/swap-page-icon.svg"
        onGoBack={() => setCurrentStep("address")}
      />
    );
  }

  // Step 3: Amount input
  return (
    <div className="flex flex-col items-center h-full w-full gap-3">
      <UserHeader
        address={evmAddress}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={() => setCurrentStep("address")}
        onShowPrivateKey={onShowPrivateKey}
      />

      {/* Header with sending to address */}
      <div className="flex items-center justify-between w-full mb-6">
        <p
          className="font-pixelify text-lg opacity-60"
          style={{ color: getVar("textAccent") }}
        >
          Sending to:
        </p>
        <p
          className="font-pixelify text-lg"
          style={{ color: getVar("textAccent") }}
        >
          {truncateAddress(recipientAddress)}
        </p>
      </div>

      {/* Center content - Amount input */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4 w-full">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-start max-h-[56px] leading-none">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="font-pixelify font-normal text-[56px] leading-none bg-transparent border-none outline-none min-w-0 flex-1 text-center"
              style={{
                color: getVar("textAccent"),
                maxWidth: "200px",
              }}
            />
          </div>

          <p className="text-sm" style={{ color: getVar("textMuted") }}>
            ${usdValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Token card with USE MAX button */}
      <div className="w-full mb-4">
        <div
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{
            backgroundColor: getVar("backgroundTertiary"),
            borderColor: getVar("borderAccent"),
          }}
        >
          <Image
            src={selectedToken!.logoUrl!}
            alt={selectedToken!.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex-1 text-left">
            <div
              className="font-medium text-sm font-pixelify"
              style={{ color: getVar("textAccent") }}
            >
              {selectedToken!.name}
            </div>
            <div className="text-xs" style={{ color: getVar("textMuted") }}>
              {formattedBalance} {selectedToken!.symbol}
            </div>
          </div>
          <button
            onClick={handleUseMax}
            className="px-1 py-0 text-xs font-pixelify text-black cursor-pointer tracking-wide"
            style={{
              backgroundColor: getVar("primary"),
            }}
          >
            USE MAX
          </button>
        </div>
      </div>

      {/* Send button */}
      <div className="w-full">
        <ATMButton
          onClick={handleSend}
          disabled={!amount || parseFloat(amount) <= 0 || isSending}
          isLoading={isSending}
        >
          Send
        </ATMButton>
      </div>
    </div>
  );
}
