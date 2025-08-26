"use client";

import { truncateAddress } from "@/utils/format";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import Image from "next/image";

interface UserHeaderProps {
  address: string | null;
  balance: number;
  isSignedIn: boolean;
}

export function UserHeader({ address, balance, isSignedIn }: UserHeaderProps) {
  const { getVar } = useThemeStyles();
  if (!isSignedIn || !address) {
    return (
      <div className="flex flex-col items-center gap-[18px] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <div 
              className="font-semibold text-xs text-center tracking-[-0.24px] leading-3"
              style={{ color: getVar('textAccent') }}
            >
              Not Connected
            </div>
          </div>
        </div>
        <div 
          className="w-full h-px"
          style={{ backgroundColor: getVar('borderPrimary') }}
        ></div>
      </div>
    );
  }

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  return (
    <div className="flex flex-col items-center gap-[18px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <div 
            className="font-inter font-semibold text-xs text-center tracking-[-0.24px] leading-3"
            style={{ color: getVar('textAccent') }}
          >
            {truncateAddress(address)}
          </div>

          <div 
            className="w-px h-[11px]"
            style={{ backgroundColor: getVar('borderPrimary') }}
          ></div>

          <button
            onClick={handleCopyAddress}
            className="w-3.5 h-3.5 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Image width={14} height={14} alt="copy-icon" src={"/copy.svg"} />
          </button>
        </div>
      </div>

      <div 
        className="w-full h-px"
        style={{ backgroundColor: getVar('borderSecondary') }}
      ></div>
    </div>
  );
}
