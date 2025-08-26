"use client";

import Image from "next/image";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import type { Token, TokenBalance } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

interface SwapInputProps {
  label: string;
  token: Token | null;
  amount: string;
  onTokenSelect: (token: Token) => void;
  onAmountChange?: (amount: string) => void;
  balance?: TokenBalance | null;
  onMaxClick?: () => void;
  readOnly?: boolean;
  network: SupportedNetwork;
  excludeToken?: Token | null;
  hasError?: boolean;
  onNavigateToTokenSelector: () => void;
}

export function SwapInput({
  label,
  token,
  amount,
  onTokenSelect,
  onAmountChange,
  balance,
  onMaxClick,
  readOnly = false,
  network,
  excludeToken,
  hasError = false,
  onNavigateToTokenSelector
}: SwapInputProps) {
  const { getVar } = useThemeStyles();
  
  const handleTokenSelectorClick = () => {
    onNavigateToTokenSelector();
  };

  return (
    <div 
      className="p-4 rounded-2xl w-full border"
      style={{
        backgroundColor: getVar('inputBackground'),
        borderColor: hasError ? getVar('borderError') : getVar('inputBorder'),
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span 
          className="text-sm tracking-tight font-['Inter']"
          style={{ color: getVar('textMuted') }}
        >
          {label}
        </span>
        {token && balance && (
          <div className="flex items-center space-x-2">
            <span 
              className="text-sm tracking-tight font-['Inter']"
              style={{ color: getVar('textMuted') }}
            >
              Bal: {(Number(balance.balance) / Math.pow(10, token.decimals)).toFixed(6)}
            </span>
            {onMaxClick && balance && (
              <button
                onClick={onMaxClick}
                className="text-xs px-2 py-1 rounded-md transition-colors font-['Inter']"
                style={{ 
                  color: getVar('textAccent'),
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${getVar('textAccent')}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type={readOnly ? "text" : "number"}
          placeholder="0.00"
          value={amount}
          onChange={onAmountChange ? (e) => {
            const value = e.target.value;
            if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
              onAmountChange(value);
            }
          } : undefined}
          onBlur={onAmountChange ? (e) => {
            const value = e.target.value;
            if (value && !isNaN(Number(value))) {
              const formatted = parseFloat(value).toString();
              onAmountChange(formatted);
            }
          } : undefined}
          readOnly={readOnly}
          className="bg-transparent border-none outline-none flex-1 max-w-[180px] text-2xl font-medium font-['Inter']"
          style={{
            color: hasError ? getVar('textError') : getVar('textPrimary'),
            '::placeholder': { color: getVar('inputPlaceholder') }
          }}
          min="0"
          step="any"
        />
        
        {/* Token Selector Button */}
        <button
          onClick={handleTokenSelectorClick}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: getVar('buttonPrimary'),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = getVar('buttonPrimaryHover');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = getVar('buttonPrimary');
          }}
        >
          {token ? (
            <>
              <Image
                src={`/icons/${token.symbol.toLowerCase()}.svg`}
                alt={token.symbol}
                width={20}
                height={20}
                className="rounded-full"
                onError={(e) => {
                  // Fallback to a default icon if token icon doesn't exist
                  e.currentTarget.src = '/icons/eth.svg';
                }}
              />
              <span 
                className="font-['Inter'] font-semibold text-sm"
                style={{ color: '#09172d' }}
              >
                {token.symbol}
              </span>
            </>
          ) : (
            <span 
              className="font-['Inter'] font-semibold text-sm"
              style={{ color: '#09172d' }}
            >
              Select Token
            </span>
          )}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path 
              d="M3 4.5L6 7.5L9 4.5" 
              stroke="#09172d" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}