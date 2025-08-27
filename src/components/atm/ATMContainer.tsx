"use client";

import { useState, useMemo } from "react";
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { SwapScreen } from "./SwapScreen";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { AuthScreens, type AuthScreen } from "./AuthScreens";
import { TabNavigation, type ATMScreen } from "./TabNavigation";
import { SimpleHomeScreen } from "./SimpleHomeScreen";
import {
  ActionButtons,
  CreditCard,
  DownloadCloud,
  Send,
  ArrowLeftRight,
} from "./ActionButtons";
import { DepositTokenScreen } from "./DepositTokenScreen";

export type { ATMScreen };
import { BottomSection } from "./BottomSection";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import Image from "next/image";
import { UserHeader } from "./UserHeader";

export function ATMContainer() {
  const [currentTab, setCurrentTab] = useState<ATMScreen>("home");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("signin");
  const [showSwapScreen, setShowSwapScreen] = useState(false);
  const [showDepositScreen, setShowDepositScreen] = useState(false);
  const address = useEvmAddress();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const isSignedIn = useIsSignedIn();
  const { theme, getVar } = useThemeStyles();

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
    console.log("Navigate to buy crypto");
  };

  const handleSendCrypto = () => {
    console.log("Navigate to send crypto");
  };

  const handleTokenSelect = (token: any) => {
    console.log("Token selected:", token);
  };

  const handleDepositToken = () => {
    setShowDepositScreen(true);
  };

  const handleTradeTokens = () => {
    setShowSwapScreen(true);
  };

  const ActionButtonScreen = ({
    leftButton,
    rightButton,
  }: {
    leftButton: any;
    rightButton: any;
  }) => {
    const { getVar } = useThemeStyles();

    return (
      <>
        <UserHeader
          address={address}
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
                background: `linear-gradient(to right, ${getVar("welcomeGradientStart")}, ${getVar("welcomeGradientEnd")})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome! Choose an action to continue...
            </p>
          </div>

          {/* Action buttons */}
          <ActionButtons leftButton={leftButton} rightButton={rightButton} />
        </div>
      </>
    );
  };

  const renderCardWrapper = (children: React.ReactNode) => (
    <div className="flex flex-col w-full px-[15px] py-4 h-full">
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
          <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (!isSignedIn) {
      return (
        <div className="flex flex-col w-full px-[15px] py-4 h-full">
          <AuthScreens
            authScreen={authScreen}
            setAuthScreen={setAuthScreen}
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
          />
        </div>
      );
    }

    switch (currentTab) {
      case "home":
        if (showDepositScreen) {
          return renderCardWrapper(
            <DepositTokenScreen onNavigate={() => setShowDepositScreen(false)} />
          );
        }
        return renderCardWrapper(
          <ActionButtonScreen
            leftButton={{
              label: "Buy with Card",
              icon: (
                <CreditCard
                  className="w-4 h-4"
                  style={{ color: getVar("textAccent") }}
                />
              ),
              onClick: handleBuyCrypto,
              variant: "secondary" as const,
            }}
            rightButton={{
              label: "Deposit Token",
              icon: (
                <DownloadCloud
                  className="w-4 h-4"
                  style={{ color: "#09172d" }}
                />
              ),
              onClick: handleDepositToken,
              variant: "primary" as const,
            }}
          />
        );

      case "swap":
        if (showSwapScreen) {
          return renderCardWrapper(
            <SwapScreen onNavigate={() => setShowSwapScreen(false)} />,
          );
        }
        return renderCardWrapper(
          <ActionButtonScreen
            leftButton={{
              label: "Send Crypto",
              icon: (
                <Send
                  className="w-4 h-4"
                  style={{ color: getVar("textAccent") }}
                />
              ),
              onClick: handleSendCrypto,
              variant: "secondary" as const,
            }}
            rightButton={{
              label: "Trade Tokens",
              icon: (
                <ArrowLeftRight
                  className="w-4 h-4"
                  style={{ color: "#09172d" }}
                />
              ),
              onClick: handleTradeTokens,
              variant: "primary" as const,
            }}
          />,
        );

      case "wallet":
        return renderCardWrapper(
          <TokenSelectorScreen
            onNavigate={() => {}}
            onTokenSelect={handleTokenSelect}
            balances={balances}
            totalUsdBalance={totalBalance}
          />,
        );

      default:
        return null;
    }
  };

  return (
    <div className="md:min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="mx-auto relative overflow-hidden flex flex-col">
          <div className="flex flex-col">{renderMainContent()}</div>

          {/* Bottom navigation tabs */}
          <TabNavigation
            currentTab={currentTab}
            onTabChange={(tab: ATMScreen) => {
              setCurrentTab(tab);
              setShowSwapScreen(false);
              setShowDepositScreen(false)
            }}
            isSignedIn={isSignedIn}
          />

          {/* Bottom section */}
          <div className="px-[15px]">
            <BottomSection />
          </div>
        </div>
      </div>
    </div>
  );
}
