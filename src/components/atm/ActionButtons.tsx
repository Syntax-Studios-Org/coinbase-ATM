"use client";

import Image from "next/image";

interface ActionButtonsProps {
  onBuyCrypto: () => void;
  onSwapTokens: () => void;
}

export function ActionButtons({
  onBuyCrypto,
  onSwapTokens,
}: ActionButtonsProps) {
  return (
    <div className="flex items-start justify-center gap-3 w-full">
      {/* Buy Crypto Button */}
      <button
        onClick={onBuyCrypto}
        className="cursor-pointer flex flex-col items-start gap-3 p-3 flex-1 bg-[#2ac876] rounded-[10px] overflow-hidden shadow-[0px_0px_0px_4px_#25b369,0px_0px_0px_3px_#102319] hover:bg-[#25b369] transition-colors"
      >
        <div className="w-4 h-4">
          <Image
            width={16}
            height={16}
            alt="buy-icon"
            src={"/buy-crypto.svg"}
          />
        </div>
        <div className="text-[#09172d] font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]">
          Buy Crypto
        </div>
      </button>

      {/* Swap Tokens Button */}
      <button
        onClick={onSwapTokens}
        className="cursor-pointer flex flex-col items-start gap-3 p-3 flex-1 rounded-[10px] border border-solid border-[#2bc87638] hover:border-[#2bc876] hover:bg-[#2bc87610] transition-all"
      >
        <div className="w-4 h-4">
          <Image
            width={16}
            height={16}
            alt="swap-icon"
            src={"/swap-tokens.svg"}
          />
        </div>
        <div className="text-[#2ac876] font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]">
          Swap tokens
        </div>
      </button>
    </div>
  );
}
