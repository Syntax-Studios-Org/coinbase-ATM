"use client";

import { useEffect, useRef, useState } from "react";
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
import { WalletLoadingScreen } from "./WalletLoadingScreen";

interface BuyWithCardScreenProps {
  onNavigate: () => void;
  onShowPrivateKey?: () => void;
}

export function BuyWithCardScreen({
  onNavigate,
  onShowPrivateKey,
}: BuyWithCardScreenProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const evmAddress = useEvmAddress();
  const { getVar } = useThemeStyles();
  const { generateOnrampUrl, state } = useOnramp();
  const [displayWidth, setDisplayWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setDisplayWidth(measureRef.current.offsetWidth);
    }
  }, [amount]);

  const allTokens = useMemo(
    () =>
      Object.values(SUPPORTED_NETWORKS).flatMap((network) =>
        Object.values(network),
      ),
    [],
  );

  const { data: balances, isLoading: isBalancesLoading } = useTokenBalances(
    "base",
    allTokens,
  );

  const totalBalance = useMemo(
    () =>
      balances?.reduce(
        (total, balance) => total + (balance.usdValue || 0),
        0,
      ) || 0,
    [balances],
  );

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleAmountChange = (value: string) => {
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

  if (!selectedToken) {
    return isBalancesLoading ? (
      <WalletLoadingScreen />
    ) : (
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

  return (
    <div className="flex flex-col items-center h-full w-full gap-3">
      {/* User header */}
      <UserHeader
        address={evmAddress}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={onNavigate}
        onShowPrivateKey={onShowPrivateKey}
      />

      {/* Main content */}
      <div className="flex flex-col items-center h-full gap-6 w-full">
        {/* You're buying text */}
        <div className="w-full text-center">
          <p
            className="font-pixelify text-xl mb-4"
            style={{ color: getVar("textPrimary") }}
          >
            You're buying
          </p>

          {/* Token and network pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Token pill */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ backgroundColor: getVar("primaryDark") }}
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
                style={{ color: getVar("textPrimary") }}
              >
                {selectedToken.symbol}
              </span>
            </div>

            <span
              className="font-pixelify text-sm"
              style={{ color: getVar("textMuted") }}
            >
              on
            </span>

            {/* Network pill */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ backgroundColor: getVar("primaryDark") }}
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
                style={{ color: getVar("textPrimary") }}
              >
                Base
              </span>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="flex flex-col items-center gap-2 w-full mt-5">
          <div className="relative flex justify-center w-full max-w-[384px]">
            {/* Ghost (visual rendering) */}
            <div className="pointer-events-none select-none text-center">
              <span
                className="font-pixelify font-normal text-2xl opacity-60 align-top relative top-1"
                style={{ color: getVar("textAccent") }}
              >
                $
              </span>
              <span
                className="font-pixelify font-normal text-[56px] leading-none"
                style={{ color: getVar("textAccent") }}
              >
                {amount || "0.00"}
              </span>
            </div>

            {/* Input overlay (invisible text, visible caret) */}
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder=""
              style={{ caretColor: getVar("textAccent") }}
              className="absolute inset-0 w-full h-full text-center bg-transparent border-none outline-none font-pixelify font-normal text-[56px] leading-none caret-current text-transparent"
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
