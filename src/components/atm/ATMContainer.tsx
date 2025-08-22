"use client";

import { useState } from "react";
import { HomeScreen } from "./HomeScreen";
import { SwapScreen } from "./SwapScreen";
import { TokenSelectorScreen } from "./TokenSelectorScreen";

export type ATMScreen = "home" | "swap" | "token-selector";

export function ATMContainer() {
  const [currentScreen, setCurrentScreen] = useState<ATMScreen>("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case "swap":
        return <SwapScreen onNavigate={setCurrentScreen} />;
      case "token-selector":
        return <TokenSelectorScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="md:min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="md:h-[850px] mx-auto relative overflow-hidden">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}
