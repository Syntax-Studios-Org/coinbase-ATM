"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserHeader } from "./UserHeader";

export function WalletLoadingScreen() {
  const address = useEvmAddress();
  const { getVar } = useThemeStyles();

  return (
    <>
      <UserHeader
        address={address}
        isSignedIn={true}
      />
      
      <div className="flex flex-col items-center justify-center gap-6 w-full flex-1">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <div className="text-center">
            <p
              className="font-pixelify text-lg mb-2"
              style={{ color: getVar("textPrimary") }}
            >
              Loading your wallet...
            </p>
            <p
              className="text-sm"
              style={{ color: getVar("textSecondary") }}
            >
              Fetching balances and prices
            </p>
          </div>
        </div>
      </div>
    </>
  );
}