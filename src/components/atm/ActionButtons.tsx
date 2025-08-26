"use client";

import Image from "next/image";
import { useThemeStyles } from "@/hooks/useThemeStyles";

interface ActionButtonsProps {
  onBuyCrypto: () => void;
  onSwapTokens: () => void;
}

export function ActionButtons({
  onBuyCrypto,
  onSwapTokens,
}: ActionButtonsProps) {
  const { getVar } = useThemeStyles();
  return (
    <div className="flex items-start justify-center gap-3 w-full">
      {/* Buy Crypto Button */}
      <button
        onClick={onBuyCrypto}
        className="cursor-pointer flex flex-col items-start gap-3 p-3 flex-1 rounded-[10px] overflow-hidden transition-colors"
        style={{
          backgroundColor: getVar('buttonPrimary'),
          boxShadow: `0px 0px 0px 4px ${getVar('buttonPrimaryHover')}, 0px 0px 0px 3px ${getVar('primaryDark')}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = getVar('buttonPrimaryHover');
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = getVar('buttonPrimary');
        }}
      >
        <div className="w-4 h-4">
          <Image
            width={16}
            height={16}
            alt="buy-icon"
            src={"/buy-crypto.svg"}
          />
        </div>
        <div 
          className="font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]"
          style={{ color: '#09172d' }}
        >
          Buy Crypto
        </div>
      </button>

      {/* Swap Tokens Button */}
      <button
        onClick={onSwapTokens}
        className="cursor-pointer flex flex-col items-start gap-3 p-3 flex-1 rounded-[10px] border border-solid transition-all"
        style={{
          borderColor: getVar('buttonSecondary'),
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = getVar('buttonSecondaryHover');
          e.currentTarget.style.backgroundColor = `${getVar('buttonSecondaryHover')}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = getVar('buttonSecondary');
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className="w-4 h-4">
          <Image
            width={16}
            height={16}
            alt="swap-icon"
            src={"/swap-tokens.svg"}
          />
        </div>
        <div 
          className="font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]"
          style={{ color: getVar('textAccent') }}
        >
          Trade tokens
        </div>
      </button>
    </div>
  );
}
