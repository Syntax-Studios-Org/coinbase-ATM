"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { UserHeader } from "./UserHeader";
import { truncateAddress } from "@/utils/format";
import Image from "next/image";
import QRCode from "react-qr-code";

interface DepositTokenScreenProps {
  onNavigate: () => void;
}

export function DepositTokenScreen({ onNavigate }: DepositTokenScreenProps) {
  const evmAddress = useEvmAddress();
  const { getVar } = useThemeStyles();

  const handleCopyAddress = async () => {
    if (evmAddress) {
      await navigator.clipboard.writeText(evmAddress);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      <UserHeader
        address={evmAddress}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={onNavigate}
      />
      <div className="flex flex-col items-center justify-between gap-6 w-full h-full">
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
              <Image width={14} height={14} alt="copy-icon" src="/copy.svg" />
            </button>
          </div>
        </div>
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

        <div
          className="w-full p-2 rounded-lg"
          style={{ backgroundColor: getVar("primaryDark") }}
        >
          <div
            className="font-pixelify text-center text-sm"
            style={{ color: getVar("primary") }}
          >
            Only transfer assets on base, depositing other assets will result in loss
          </div>
        </div>
      </div>
    </div>
  );
}
