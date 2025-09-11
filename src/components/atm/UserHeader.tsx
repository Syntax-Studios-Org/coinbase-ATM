"use client";

import { useState } from "react";
import { truncateAddress } from "@/utils/format";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import {
  useEvmAddress,
  useSignOut,
  useExportEvmAccount,
} from "@coinbase/cdp-hooks";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { LogOut, Download, Loader2, Check } from "lucide-react";

interface UserHeaderProps {
  address: string | null;
  isSignedIn: boolean;
  showGoBack?: boolean;
  onGoBack?: () => void;
  showSettings?: boolean;
  slippage?: number;
  onSlippageChange?: (slippage: number) => void;
}

export function UserHeader({
  address,
  isSignedIn,
  showGoBack = false,
  onGoBack,
  showSettings = false,
  slippage = 5,
  onSlippageChange,
}: UserHeaderProps) {
  const { getVar } = useThemeStyles();
  const signOut = useSignOut();
  const exportEvmAccount = useExportEvmAccount();
  const evmAddress = useEvmAddress();

  const [customSlippage, setCustomSlippage] = useState(slippage.toString());
  const [addressCopied, setAddressCopied] = useState(false);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isSignedIn || !address) {
    return (
      <div className="flex flex-col items-center gap-[18px] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <div
              className="font-semibold text-xs text-center tracking-[-0.24px] leading-3"
              style={{ color: getVar("textAccent") }}
            >
              Not Connected
            </div>
          </div>
        </div>
        <div
          className="w-full h-px"
          style={{ backgroundColor: getVar("borderPrimary") }}
        ></div>
      </div>
    );
  }

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (address) {
      await navigator.clipboard.writeText(address);
    }
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 2000);
  };

  const handleSlippageChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onSlippageChange?.(numValue);
    }
  };

  const setAutoSlippage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomSlippage("5");
    onSlippageChange?.(5);
  };

  const exportPrivateKey = async () => {
    if (evmAddress && !isExporting && !privateKeyCopied) {
      try {
        setIsExporting(true);
        const { privateKey } = await exportEvmAccount({
          evmAccount: evmAddress,
        });
        await navigator.clipboard.writeText(privateKey);
        setPrivateKeyCopied(true);
        setTimeout(() => setPrivateKeyCopied(false), 3000);
      } catch (error) {
        console.error("Failed to export private key:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  // Address dropdown pill component
  const AddressPill = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex cursor-pointer items-center gap-1.5 px-0.5 py-0.5 rounded hover:opacity-80 transition-opacity"
          style={{
            height: "20px",
            borderRadius: "4px",
            padding: "2px 4px 2px 2px",
            gap: "6px",
            backgroundColor: getVar("backgroundSecondary"),
          }}
        >
          <Image
            src="/address-panda.png"
            alt="Address"
            width={16}
            height={16}
            className="rounded-xs"
          />
          <span
            className="text-xs font-medium truncate"
            style={{ color: getVar("textPrimary") }}
          >
            {truncateAddress(address)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-3"
        style={{
          backgroundColor: getVar("backgroundTertiary"),
          border: `1px solid ${getVar("borderPrimary")}`,
        }}
      >
        <DropdownMenuItem>
          <div className="flex items-center gap-3 mb-1">
            <Image
              src="/address-panda.png"
              alt="Address"
              width={32}
              height={32}
              className="rounded-md"
            />
            <div className="flex items-center gap-2 flex-1">
              <span
                className="text-sm font-medium"
                style={{ color: getVar("textPrimary") }}
              >
                {truncateAddress(address)}
              </span>
              <button
                onClick={handleCopyAddress}
                className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {addressCopied ? (
                  <Image
                    width={14}
                    height={14}
                    alt="copied-icon"
                    src={"/check-tick-double.svg"}
                  />
                ) : (
                  <Image
                    width={14}
                    height={14}
                    alt="copy-icon"
                    src={"/copy.svg"}
                  />
                )}
              </button>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportPrivateKey}
          disabled={isExporting || privateKeyCopied}
          title="Copy your private key to clipboard - Keep it safe!"
          className="cursor-pointer"
        >
          <div className="flex items-center space-x-3 w-full p-1 cursor-pointer">
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : privateKeyCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isExporting
                ? "Exporting..."
                : privateKeyCopied
                  ? "Private Key Copied!"
                  : "Copy Private Key"}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator
          style={{ backgroundColor: getVar("borderPrimary") }}
        />
        <DropdownMenuItem
          onClick={signOut}
          className="mt-2 cursor-pointer rounded-md text-center w-full mx-auto"
          style={{
            color: getVar("textColorDisconnect"),
            backgroundColor: getVar("backgroundDisconnect"),
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" color={getVar("textColorDisconnect")} />
            <span>Disconnect</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Settings dropdown component
  const SettingsDropdown = () => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:opacity-80 transition-opacity cursor-pointer">
          <Image
            src="/settings-gear.svg"
            alt="Settings"
            width={20}
            height={20}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-4"
        style={{
          backgroundColor: getVar("backgroundTertiary"),
          border: `1px solid ${getVar("borderPrimary")}`,
        }}
      >
        <div
          className="space-y-3"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            className="text-sm font-medium"
            style={{ color: getVar("textPrimary") }}
          >
            Set slippage
          </div>
          <div
            className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-md"
            style={{
              width: "215px",
            }}
          >
            <input
              type="number"
              value={customSlippage}
              onChange={(e) => handleSlippageChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: getVar("textPrimary") }}
              placeholder="5"
              min="0"
              step="0.5"
            />
            <button
              onClick={setAutoSlippage}
              className="flex items-center justify-center text-xs font-medium cursor-pointer"
              style={{
                width: "38px",
                height: "18px",
                borderRadius: "20px",
                backgroundColor: getVar("primary"),
                color: "black",
                padding: "2px 5px",
              }}
            >
              AUTO
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex flex-col items-center gap-[18px] w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Go back button or Address pill */}
        <div className="flex items-center gap-3">
          {showGoBack && onGoBack ? (
            <button
              onClick={onGoBack}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/back-arrow.svg"
                alt="Go back"
                width={16}
                height={16}
              />
              <span
                className="text-xs font-medium"
                style={{ color: getVar("textMuted") }}
              >
                Go back
              </span>
            </button>
          ) : (
            <AddressPill />
          )}
        </div>

        {/* Right side - Address pill (when go back is shown) or Settings */}
        <div className="flex items-center gap-3">
          {showGoBack && <AddressPill />}
          {showSettings && <SettingsDropdown />}
        </div>
      </div>

      <div
        className="w-full h-px"
        style={{ backgroundColor: getVar("borderSecondary") }}
      ></div>
    </div>
  );
}
