"use client";

import { useState } from "react";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useOnramp } from "@/hooks/useOnramp";
import { UserHeader } from "./UserHeader";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { ATMButton } from "@/components/ui/ATMButton";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { useMemo } from "react";
import type { Token } from "@/types/swap";
import type { SupportedOnrampAsset } from "@/types/onramp";
import Image from "next/image";

interface BuyWithCardScreenProps {
  onNavigate: () => void;
}

export function BuyWithCardScreen({ onNavigate }: BuyWithCardScreenProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const evmAddress = useEvmAddress();
  const { getVar } = useThemeStyles();
  const { generateOnrampUrl, state } = useOnramp();

  // Get all tokens from all networks for balance calculation
  const allTokens = useMemo(
    () =>
      Object.values(SUPPORTED_NETWORKS).flatMap((network) =>
        Object.values(network),
      ),
    [],
  );
  const { data: balances } = useTokenBalances("base", allTokens);

  // Calculate total balance in USD
  const totalBalance =
    balances?.reduce((total, balance) => {
      return total + (balance.usdValue || 0);
    }, 0) || 0;

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleRequestLink = async () => {
    if (!selectedToken || !amount || !evmAddress) return;

    try {
      const fiatAmount = parseFloat(amount);
      if (fiatAmount <= 0 || fiatAmount < 2) return;

      const url = await generateOnrampUrl({
        destinationAddress: evmAddress,
        fiatAmount,
        fiatCurrency: "USD",
        cryptoAsset: selectedToken.symbol as SupportedOnrampAsset,
        network: "base",
        paymentMethod: "CARD",
      });

      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Failed to generate onramp URL:", error);
    }
  };

  // Show token selector first
  if (!selectedToken) {
    return (
      <TokenSelectorScreen
        onNavigate={onNavigate}
        onTokenSelect={handleTokenSelect}
        balances={balances}
        totalUsdBalance={totalBalance}
        text="Select a token to buy with card..."
        onGoBack={onNavigate}
      />
    );
  }

  // Show buy screen after token selection
  return (
    <div className="flex flex-col items-center h-full w-full gap-3">
      {/* User header */}
      <UserHeader
        address={evmAddress}
        balance={totalBalance}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={onNavigate}
      />

      {/* Main content */}
      <div className="flex flex-col items-center h-full gap-6 w-full">
        {/* You're buying text */}
        <div className="w-full text-center">
          <p
            className="font-pixelify text-xl mb-4"
            style={{ color: getVar('textPrimary') }}
          >
            You're buying
          </p>

          {/* Token and network pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Token pill */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ backgroundColor: getVar('primaryDark') }}
            >
              <Image
                src={selectedToken.logoUrl!}
                alt={selectedToken.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span
                className="font-pixelify text-sm"
                style={{ color: getVar('textPrimary') }}
              >
                {selectedToken.symbol}
              </span>
            </div>

            <span
              className="font-pixelify text-sm"
              style={{ color: getVar('textMuted') }}
            >
              on
            </span>

            {/* Network pill */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ backgroundColor: getVar('primaryDark') }}
            >
              <Image
                src="/icons/base.svg"
                alt="Base"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span
                className="font-pixelify text-sm"
                style={{ color: getVar('textPrimary') }}
              >
                Base
              </span>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="flex flex-col items-center gap-2 w-full mt-5">
          <div className="flex items-start max-h-[56px] leading-none">
            <p
              className="font-pixelify font-normal text-2xl opacity-60 mt-[6px]"
              style={{ color: getVar("textAccent") }}
            >
              $
            </p>
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="font-pixelify font-normal text-[56px] leading-none bg-transparent border-none outline-none min-w-0 flex-1"
              style={{
                color: getVar("textAccent"),
                maxWidth: "120px",
              }}
            />
          </div>
        </div>


      </div>

      {/* Request link button */}
      <div className="w-full">
        <ATMButton
          onClick={handleRequestLink}
          disabled={!amount || parseFloat(amount) < 2 || state.isGeneratingUrl}
          isLoading={state.isGeneratingUrl}
        >
          Request Link
        </ATMButton>
      </div>
    </div>
  );
}
