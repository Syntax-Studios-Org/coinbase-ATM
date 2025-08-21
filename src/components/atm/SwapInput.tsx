"use client";

import Image from "next/image";
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
  
  const handleTokenSelectorClick = () => {
    onNavigateToTokenSelector();
  };

  return (
    <div className={`p-4 bg-[#141519] rounded-2xl w-full ${hasError ? 'border border-[#DF6A70]' : 'border border-[#2bc87638]'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-sm tracking-tight font-['Inter']">{label}</span>
        {token && balance && (
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm tracking-tight font-['Inter']">
              Bal: {(Number(balance.balance) / Math.pow(10, token.decimals)).toFixed(6)}
            </span>
            {onMaxClick && balance && (
              <button
                onClick={onMaxClick}
                className="text-[#2bc876] text-xs px-2 py-1 rounded-md transition-colors hover:bg-[#2bc87610] font-['Inter']"
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
          className={`bg-transparent placeholder-white/40 border-none outline-none flex-1 max-w-[180px] text-2xl font-medium font-['Inter'] ${
            hasError ? 'text-[#DF6A70]' : 'text-white'
          }`}
          min="0"
          step="any"
        />
        
        {/* Token Selector Button */}
        <button
          onClick={handleTokenSelectorClick}
          className="flex items-center gap-2 px-3 py-2 bg-[#2bc876] rounded-lg hover:bg-[#25b369] transition-colors"
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
              <span className="text-[#09172d] font-['Inter'] font-semibold text-sm">
                {token.symbol}
              </span>
            </>
          ) : (
            <span className="text-[#09172d] font-['Inter'] font-semibold text-sm">
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