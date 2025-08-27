"use client";

import { DollarSign, ArrowLeftRight } from "lucide-react";
import { useThemeStyles } from "@/hooks/useThemeStyles";

interface SimpleHomeScreenProps {
  onBuyCrypto: () => void;
  onSendCrypto: () => void;
}

export function SimpleHomeScreen({ onBuyCrypto, onSendCrypto }: SimpleHomeScreenProps) {
  const { getVar } = useThemeStyles();

  return (
    <>
      {/* Welcome message and icon */}
      <div className="h-[434px] flex flex-col items-center gap-4">
        <div className="w-8 h-8">
          <DollarSign className="w-8 h-8" style={{ color: getVar('textAccent') }} />
        </div>
        <p
          className="w-[286px] bg-clip-text text-transparent font-pixelify font-normal text-2xl tracking-[0.48px] leading-[28.8px]"
          style={{
            background: `linear-gradient(to right, ${getVar('welcomeGradientStart')}, ${getVar('welcomeGradientEnd')})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Choose an action to continue...
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-start justify-center gap-3 w-full">
        {/* Send Crypto Button */}
        <button
          onClick={onSendCrypto}
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
            <ArrowLeftRight className="w-4 h-4" style={{ color: getVar('textAccent') }} />
          </div>
          <div
            className="font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]"
            style={{ color: getVar('textAccent') }}
          >
            Send Crypto
          </div>
        </button>

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
            <DollarSign className="w-4 h-4" style={{ color: '#09172d' }} />
          </div>
          <div
            className="font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]"
            style={{ color: '#09172d' }}
          >
            Buy Crypto
          </div>
        </button>
      </div>
    </>
  );
}
