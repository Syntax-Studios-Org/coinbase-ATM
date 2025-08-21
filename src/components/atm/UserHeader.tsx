"use client";

import { truncateAddress } from "@/utils/format";
import Image from "next/image";

interface UserHeaderProps {
  address: string | null;
  balance: number;
  isSignedIn: boolean;
}

export function UserHeader({ address, balance, isSignedIn }: UserHeaderProps) {
  if (!isSignedIn || !address) {
    return (
      <div className="flex flex-col items-center gap-[18px] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <div className="text-[#2ac876] font-semibold text-xs text-center tracking-[-0.24px] leading-3">
              Not Connected
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-white/20"></div>
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
          <div className="text-[#2ac876] font-inter font-semibold text-xs text-center tracking-[-0.24px] leading-3">
            {truncateAddress(address)}
          </div>

          <div className="w-px h-[11px] bg-white/20"></div>

          <button
            onClick={handleCopyAddress}
            className="w-3.5 h-3.5 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Image width={14} height={14} alt="copy-icon" src={"/copy.svg"} />
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-white/10"></div>
    </div>
  );
}
