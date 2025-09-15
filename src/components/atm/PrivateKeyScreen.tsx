"use client";

import { useState } from "react";
import { useEvmAddress, useExportEvmAccount } from "@coinbase/cdp-hooks";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { UserHeader } from "./UserHeader";
import { ATMButton } from "@/components/ui/ATMButton";
import { EyeOff, Eye } from "lucide-react";

interface PrivateKeyScreenProps {
  onNavigate: () => void;
}

export function PrivateKeyScreen({ onNavigate }: PrivateKeyScreenProps) {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { getVar } = useThemeStyles();
  const exportEvmAccount = useExportEvmAccount();
  const evmAddress = useEvmAddress();

  const handleExportPrivateKey = async () => {
    if (!evmAddress || isExporting) return;

    try {
      setIsExporting(true);
      const { privateKey: exportedKey } = await exportEvmAccount({
        evmAccount: evmAddress,
      });
      setPrivateKey(exportedKey);

      try {
        await navigator.clipboard.writeText(exportedKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    } catch (error) {
      console.error("Failed to export private key:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (isCopied) return;

    if (!privateKey) {
      await handleExportPrivateKey();
    }

    try {
      await navigator.clipboard.writeText(privateKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleClose = () => {
    setPrivateKey("");
    setIsKeyVisible(false);
    setIsCopied(false);
    onNavigate();
  };

  return (
    <div className="flex flex-col items-center h-full w-full gap-3">
      {/* User header */}
      <UserHeader
        address={evmAddress}
        isSignedIn={!!evmAddress}
        showGoBack={true}
        onGoBack={onNavigate}
      />

      {/* Main content */}
      <div className="flex flex-col items-center h-full gap-6 w-full">
        {/* Header */}
        <div className="w-full text-center">
          <h1
            className="font-pixelify text-2xl"
            style={{ color: getVar("textAccent") }}
          >
            Your private key
          </h1>
          <p
            className="font-pixelify text-sm"
            style={{ color: getVar("textSecondary") }}
          >
            For your eyes only. Do not share.
          </p>
        </div>

        {/* Private key display */}
        <div className="flex-1 flex flex-col justify-center w-full gap-4">
          <div
            className="relative w-full p-4 rounded-lg"
            style={{
              border: "1px solid #292B30",
              backgroundColor: getVar("inputBackground"),
            }}
          >
            <div className="pr-10">
              {isExporting ? (
                <div className="flex items-center justify-center py-4">
                  <div
                    className="animate-spin rounded-full h-6 w-6 border-b-2"
                    style={{ borderColor: getVar("textAccent") }}
                  ></div>
                </div>
              ) : (
                <p
                  className="font-mono text-sm break-all"
                  style={{
                    color: getVar("textPrimary"),
                    filter: isKeyVisible ? "none" : "blur(4px)",
                  }}
                >
                  {privateKey || "Loading..."}
                </p>
              )}
            </div>

            {/* Eye icon */}
            <button
              onClick={() => setIsKeyVisible(!isKeyVisible)}
              className="absolute bottom-3 right-3 p-1 hover:opacity-70"
              disabled={isExporting || !privateKey}
            >
              {isKeyVisible ? (
                <Eye size={16} style={{ color: getVar("textMuted") }} />
              ) : (
                <EyeOff size={16} style={{ color: getVar("textMuted") }} />
              )}
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg font-pixelify text-sm transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: getVar("primaryDark"),
              color: getVar("textPrimary"),
              border: `1px solid ${getVar("borderAccent")}`,
            }}
          >
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>

      {/* Done button */}
      <div className="w-full">
        <ATMButton onClick={handleClose}>Done</ATMButton>

        {/* Warning text */}
        <p
          className="font-pixelify text-xs text-center mt-2 px-1"
          style={{ color: getVar("textSecondary") }}
        >
          Your private key can be used to access everything in your wallet.
          Don't share it with anyone.
        </p>
      </div>
    </div>
  );
}
