"use client";

import { DollarSign, ArrowLeftRight, Wallet } from "lucide-react";
import { useThemeStyles } from "@/hooks/useThemeStyles";

export type ATMScreen = "home" | "swap" | "wallet";

interface TabNavigationProps {
  currentTab: ATMScreen;
  onTabChange: (tab: ATMScreen) => void;
  isSignedIn: boolean;
}

export function TabNavigation({ currentTab, onTabChange, isSignedIn }: TabNavigationProps) {
  const { getVar } = useThemeStyles();

  const renderTabButton = (tab: ATMScreen, icon: React.ReactNode) => {
    const isActive = currentTab === tab;
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={`flex-1 h-[73px] rounded-2xl border-2 border-black relative transition-all ${
          !isSignedIn ? 'opacity-50' : ''
        }`}
        disabled={!isSignedIn}
        style={{
          backgroundImage: 'linear-gradient(105.55deg, rgba(95, 98, 101, 0.4) 0%, rgba(50, 51, 53, 0.4) 100%), linear-gradient(0deg, rgba(70, 72, 77, 0.2), rgba(70, 72, 77, 0.2)), url(/cta-button-bg-img.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxShadow: '0px 1px 4px 0px #0000004D, -1px -1px 1px 0px #1A1A1A99 inset, 1px 1px 1px 0px #A9A9A938 inset'
        }}
      >
        <div className="flex items-center justify-center px-4 py-3 w-full h-full rounded-2xl">
          <div style={{
            color: isActive
              ? getVar('textAccent')
              : getVar('textMuted')
          }}>
            {icon}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="px-[15px] pb-10">
      <div className="flex items-center gap-2 w-full">
        {renderTabButton("home", <DollarSign className="w-5 h-5" />)}
        {renderTabButton("swap", <ArrowLeftRight className="w-5 h-5" />)}
        {renderTabButton("wallet", <Wallet className="w-5 h-5" />)}
      </div>
    </div>
  );
}
