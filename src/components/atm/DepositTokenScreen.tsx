"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { UserHeader } from "./UserHeader";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import { useMemo } from "react";
import { truncateAddress } from "@/utils/format";
import Image from "next/image";
import QRCode from "react-qr-code";

interface DepositTokenScreenProps {
  onNavigate: () => void;
}

export function DepositTokenScreen({ onNavigate }: DepositTokenScreenProps) {
  const evmAddress = useEvmAddress();
  const { getVar } = useThemeStyles();

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

  const handleCopyAddress = async () => {
    if (evmAddress) {
      await navigator.clipboard.writeText(evmAddress);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      {/* User header */}
      <UserHeader
        address={evmAddress}
        balance={totalBalance}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={onNavigate}
      />

      {/* Main content */}
      <div className="flex flex-col items-center justify-between gap-6 w-full h-full">
        {/* Address section */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs" style={{ color: getVar("textMuted") }}>
            Your address
          </div>
          <div className="flex items-center gap-2">
            <div
              className="font-pixelify text-2xl"
              style={{ color: getVar("textPrimary") }}
            >
              {evmAddress ? truncateAddress(evmAddress) : ""}
            </div>
            <button
              onClick={handleCopyAddress}
              className="w-3.5 h-3.5 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image width={14} height={14} alt="copy-icon" src={"/copy.svg"} />
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div
          className="flex items-center justify-center p-3 rounded-md"
          style={{
            background: getVar("primaryDark"),
          }}
        >
          <QRCode
            value={evmAddress || ""}
            size={120}
            style={{ maxWidth: "120px", maxHeight: "120px" }}
            bgColor={getVar("primaryDark")}
            fgColor={getVar("primary")}
          />
        </div>

        {/* Warning message */}
        <div
          className="w-full p-2 rounded-lg"
          style={{ backgroundColor: getVar("primaryDark") }}
        >
          <div
            className="font-pixelify text-center text-sm"
            style={{ color: getVar("primary") }}
          >
            Only transfer assets on base, depositing other assets will result in
            loss
          </div>
        </div>
      </div>
    </div>
  );
}
