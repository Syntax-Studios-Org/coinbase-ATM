"use client";

import { useState, useMemo } from "react";
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import Image from "next/image";

import { SwapScreen } from "./SwapScreen";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { AuthScreens, type AuthScreen } from "./AuthScreens";
import { TabNavigation, type ATMScreen } from "./TabNavigation";
import { ActionButtons, CreditCard, DownloadCloud, Send, ArrowLeftRight } from "./ActionButtons";
import { DepositTokenScreen } from "./DepositTokenScreen";
import { BuyWithCardScreen } from "./BuyWithCardScreen";
import { SendCryptoScreen } from "./SendCryptoScreen";
import { TransactionReceiptModal } from "./TransactionReceiptModal";
import { TutorialOverlay } from "./TutorialOverlay";
import { BottomSection } from "./BottomSection";
import { UserHeader } from "./UserHeader";

import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTutorial } from "@/hooks/useTutorial";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { WalletLoadingScreen } from "./WalletLoadingScreen";

export type { ATMScreen };

export function ATMContainer() {
  const [currentTab, setCurrentTab] = useState<ATMScreen>("home");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("signin");
  const [showSwapScreen, setShowSwapScreen] = useState(false);
  const [showDepositScreen, setShowDepositScreen] = useState(false);
  const [showBuyWithCardScreen, setShowBuyWithCardScreen] = useState(false);
  const [showSendCryptoScreen, setShowSendCryptoScreen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"swap" | "send">("swap");
  const [transactionTokens, setTransactionTokens] = useState<{
    fromToken: any;
    toToken: any;
    fromAmount: string;
    toAmount: string;
  }>({
    fromToken: null,
    toToken: null,
    fromAmount: "",
    toAmount: "",
  });
  const address = useEvmAddress();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const isSignedIn = useIsSignedIn();
  const { theme, getVar } = useThemeStyles();
  const { showTutorial, isLoading: tutorialLoading, completeTutorial } = useTutorial();

  const allTokens = useMemo(
    () => Object.values(SUPPORTED_NETWORKS).flatMap((network) => Object.values(network)),
    [],
  );

  const { data: balances, totalUsdBalance, isLoading: balancesLoading } = useTokenBalances("base", allTokens);

  const handleBuyCrypto = () => {
    setShowBuyWithCardScreen(true);
  };

  const handleSendCrypto = () => {
    setShowSendCryptoScreen(true);
  };

  const handleTokenSelect = (token: any) => {
    // Token selection handled by individual screens
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
          isSignedIn={isSignedIn}
        />

        <div className="flex flex-col items-start justify-center gap-8 w-full">
          <div className="flex flex-col items-start gap-4">
            <div className="w-8 h-8">
              <Image
                width={32}
                height={32}
                src="/thumb.svg"
                alt="Coin Icon"
              />
            </div>
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
          <ActionButtons leftButton={leftButton} rightButton={rightButton} />
        </div>
      </>
    );
  };


  const renderCardWrapper = (children: React.ReactNode) => (
    <div className="flex flex-col w-full px-[15px] py-4 h-full">
      <div
        className="w-full h-[434px] rounded-[20px] overflow-hidden relative p-[1px]"
        style={{ background: theme.cardBorder }}
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
            <DepositTokenScreen
              onNavigate={() => setShowDepositScreen(false)}
            />,
          );
        }
        if (showBuyWithCardScreen) {
          return renderCardWrapper(
            <BuyWithCardScreen
              onNavigate={() => setShowBuyWithCardScreen(false)}
            />,
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
          />,
        );

      case "swap":
        if (showSendCryptoScreen) {
          return renderCardWrapper(
            <SendCryptoScreen
              onNavigate={() => setShowSendCryptoScreen(false)}
              onSendComplete={(txHash, tokenData) => {
                setTransactionHash(txHash);
                setTransactionType("send");
                if (tokenData) {
                  setTransactionTokens(tokenData);
                }
                setShowTransactionModal(true);
              }}
            />,
          );
        }
        if (showSwapScreen) {
          return renderCardWrapper(
            <SwapScreen
              onNavigate={() => setShowSwapScreen(false)}
              onSwapComplete={(txHash, tokenData) => {
                setTransactionHash(txHash);
                setTransactionType("swap");
                if (tokenData) {
                  setTransactionTokens(tokenData);
                }
                setShowTransactionModal(true);
              }}
            />,
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
        if (balancesLoading) {
          return renderCardWrapper(<WalletLoadingScreen />);
        }
        return renderCardWrapper(
          <TokenSelectorScreen
            onNavigate={() => {}}
            onTokenSelect={handleTokenSelect}
            balances={balances}
            totalUsdBalance={totalUsdBalance}
          />,
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="mx-auto relative overflow-hidden flex flex-col">
          <div className="flex flex-col">{renderMainContent()}</div>

          {/* Bottom navigation tabs */}
          <TabNavigation
            currentTab={currentTab}
            onTabChange={(tab: ATMScreen) => {
              setCurrentTab(tab);
              setShowSwapScreen(false);
              setShowDepositScreen(false);
              setShowBuyWithCardScreen(false);
              setShowSendCryptoScreen(false);
              setShowTransactionModal(false);
            }}
            isSignedIn={isSignedIn}
          />

          {/* Bottom section */}
          <div className="px-[15px]">
            <BottomSection>
              {/* Transaction Receipt Modal */}
              {showTransactionModal && (
                <TransactionReceiptModal
                  isOpen={showTransactionModal}
                  onClose={() => {
                    setShowTransactionModal(false);
                    setTransactionHash("");
                  }}
                  fromToken={transactionTokens.fromToken}
                  toToken={transactionTokens.toToken}
                  fromAmount={transactionTokens.fromAmount}
                  toAmount={transactionTokens.toAmount}
                  network="base"
                  transactionHash={transactionHash}
                  isExecuting={!transactionHash}
                  transactionType={transactionType}
                />
              )}
            </BottomSection>
          </div>

          {/* Tutorial Overlay */}
          <TutorialOverlay
            isOpen={showTutorial && !tutorialLoading}
            onClose={completeTutorial}
          />

          {/* Tutorial Overlay */}
          {!tutorialLoading && (
            <TutorialOverlay
              isOpen={showTutorial}
              onClose={completeTutorial}
            />
          )}
        </div>
      </div>
    </div>
  );
}
