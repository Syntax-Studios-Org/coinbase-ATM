"use client";

import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { TutorialOverlay } from "./TutorialOverlay";
import { UserHeader } from "./UserHeader";
import { ActionButtons } from "./ActionButtons";
import { ATMScreen } from "./ATMContainer";
import { CTAButton } from "@/components/ui";
import { useState, useMemo } from "react";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { useTutorial } from "@/hooks/useTutorial";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import Image from "next/image";

interface HomeScreenProps {
  onNavigate: (screen: ATMScreen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const isSignedIn = useIsSignedIn();
  const evmAddress = useEvmAddress();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { showTutorial, isLoading, completeTutorial } = useTutorial();
  const { getVar, theme } = useThemeStyles();

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

  const handleBuyCrypto = () => {
    if (!isSignedIn) {
      setShowConnectModal(true);
      return;
    }
    // Navigate to onramp flow
    console.log("Navigate to buy crypto");
  };

  const handleSwapTokens = () => {
    if (!isSignedIn) {
      setShowConnectModal(true);
      return;
    }
    onNavigate("swap");
  };

  const handleConnectWallet = () => {
    setShowConnectModal(true);
  };

  return (
    <div className="flex flex-col w-full max-w-[390px] mx-auto px-[15px] py-10 md:py-[105px] min-h-screen">
      {/* Main content card */}
      <div
        className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
        style={{
          background: theme.cardBorder,
        }}
      >
        <div
          className="w-full h-full rounded-[20px] relative"
          style={{
            background: theme.cardBackground,
            boxShadow: "0px 0px 14px 0px #00000026 inset",
          }}
        >
          <div className="relative z-10 flex flex-col items-center justify-between pt-[18px] pb-6 px-6 h-full">
            {/* User header */}
            <UserHeader
              address={evmAddress}
              balance={totalBalance}
              isSignedIn={isSignedIn}
            />

            {/* Welcome message and action buttons */}
            <div className="flex flex-col items-start justify-center gap-8 w-full">
              <div className="flex flex-col items-start gap-4">
                {/* Coin icon */}
                <div className="w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={"/thumb.svg"}
                    alt="Coin Icon"
                  />
                </div>

                {/* Welcome text */}
                <p 
                  className="w-[286px] bg-clip-text text-transparent font-pixelify font-normal text-2xl tracking-[0.48px] leading-[28.8px]"
                  style={{
                    background: `linear-gradient(to right, ${getVar('welcomeGradientStart')}, ${getVar('welcomeGradientEnd')})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Welcome! Choose an action to continue...
                </p>
              </div>

              {/* Action buttons */}
              <ActionButtons
                onBuyCrypto={handleBuyCrypto}
                onSwapTokens={handleSwapTokens}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Connect wallet button */}
      {!isSignedIn && (
        <CTAButton onClick={handleConnectWallet} className="mt-[10px]" text="Connect Wallet"/>
      )}
      {isSignedIn && (
        <CTAButton onClick={handleSwapTokens} className="mt-[10px]" text="Trade Tokens"/>
      )}

      {/* Bottom section */}
      <div className="flex items-center justify-center mt-[20px] mb-2">
        <div 
          className="font-medium text-[9px] text-center tracking-[2.75px] leading-[15px] mix-blend-color-dodge opacity-32"
          style={{ color: getVar('textPrimary') }}
        >
          COLLECT YOUR CRYPTO
        </div>
      </div>

      {/* Bottom card */}
      <div 
        className="w-full flex flex-col items-center justify-center gap-2.5 p-2 rounded-lg border-[0.7px]"
        style={{ borderColor: getVar('borderPrimary') }}
      >
        <div 
          className="w-full h-[26px] rounded-[3px] p-px relative" 
          style={{ background: theme.cardBorder }}
        >
          <div 
            className="w-full h-full rounded-[3px] relative" 
            style={{
              background: 'linear-gradient(104.62deg, #1A1A1A 0.45%, #090909 100%)',
              boxShadow: '0px 0px 18px 0px #000000E5 inset'
            }}
          >
            <div 
              className="absolute w-px h-[11px] -top-3 left-1/2 transform -translate-x-1/2 mix-blend-color-dodge"
              style={{ backgroundColor: getVar('borderPrimary') }}
            ></div>
          </div>
        </div>
      </div>

      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />

      <TutorialOverlay
        isOpen={showTutorial && !isLoading}
        onClose={completeTutorial}
      />
    </div>
  );
}
