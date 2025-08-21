"use client";

import { formatUnits } from "viem";
import Image from "next/image";
import { Dialog, DialogContent, Button } from "@/components/ui";
import { getTokenDecimals, getTokenSymbol } from "@/utils/tokens";
import type { Token, SwapQuote } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

interface ReviewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  priceData: SwapQuote | null;
  isExecuting: boolean;
  network: SupportedNetwork;
}

export function ReviewTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  fromToken,
  toToken,
  fromAmount,
  priceData,
  isExecuting,
  network
}: ReviewTransactionModalProps) {

  if (!fromToken || !toToken || !priceData) return null;

  const toAmount = formatUnits(
    priceData.toAmount,
    getTokenDecimals(toToken.address, network)
  );

  const exchangeRate = Number(toAmount) / Number(fromAmount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[360px] bg-gradient-radial from-[#091408] to-[#050a07] border border-[#2bc87638] rounded-[20px] p-0 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-[#2bc876] font-pixelify font-semibold text-lg">
            Review Swap
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Transaction details */}
        <div className="p-6 space-y-6">

          {/* From/To display */}
          <div className="space-y-4">
            {/* From */}
            <div className="flex items-center justify-between p-4 bg-[#141519] rounded-lg border border-[#2bc87638]">
              <div className="flex items-center gap-3">
                <Image
                  src={`/icons/${fromToken.symbol.toLowerCase()}.svg`}
                  alt={fromToken.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/eth.svg';
                  }}
                />
                <div>
                  <div className="text-white font-['Inter'] font-medium text-sm">
                    {fromToken.symbol}
                  </div>
                  <div className="text-white/60 font-['Inter'] text-xs">
                    {fromToken.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-['Inter'] font-medium text-lg">
                  -{fromAmount}
                </div>
                <div className="text-white/60 font-['Inter'] text-xs">
                  From
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-[#2bc876] rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3V13M3 8L8 13L13 8"
                    stroke="#09172d"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* To */}
            <div className="flex items-center justify-between p-4 bg-[#141519] rounded-lg border border-[#2bc87638]">
              <div className="flex items-center gap-3">
                <Image
                  src={`/icons/${toToken.symbol.toLowerCase()}.svg`}
                  alt={toToken.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/eth.svg';
                  }}
                />
                <div>
                  <div className="text-white font-['Inter'] font-medium text-sm">
                    {toToken.symbol}
                  </div>
                  <div className="text-white/60 font-['Inter'] text-xs">
                    {toToken.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#2bc876] font-['Inter'] font-medium text-lg">
                  +{Number(toAmount).toFixed(6)}
                </div>
                <div className="text-white/60 font-['Inter'] text-xs">
                  To
                </div>
              </div>
            </div>
          </div>

          {/* Transaction details */}
          <div className="space-y-3 p-4 bg-[#141519] rounded-lg border border-[#2bc87638]">
            <h3 className="text-white font-['Inter'] font-medium text-sm">
              Transaction Details
            </h3>

            <div className="space-y-2 text-xs font-['Inter']">
              <div className="flex justify-between">
                <span className="text-white/60">Exchange Rate</span>
                <span className="text-white">
                  1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/60">Network</span>
                <span className="text-white">
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/60">Slippage Tolerance</span>
                <span className="text-white">1%</span>
              </div>

              {priceData.gas && (
                <div className="flex justify-between">
                  <span className="text-white/60">Est. Gas Fee</span>
                  <span className="text-white">
                    {formatUnits(priceData.gas, 18)} ETH
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-[#2bc87610] border border-[#2bc87638] rounded-lg">
            <div className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
                <path
                  d="M8 1L15 14H1L8 1Z"
                  stroke="#2bc876"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M8 6V9M8 12H8.01"
                  stroke="#2bc876"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-white/80 text-xs font-['Inter'] leading-relaxed">
                Please review all details carefully. This transaction cannot be reversed once confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#2bc87638] text-white hover:bg-[#2bc87610] font-['Inter']"
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isExecuting}
            isLoading={isExecuting}
            className="flex-1 bg-[#2bc876] hover:bg-[#25b369] text-[#09172d] font-pixelify font-semibold"
          >
            {isExecuting ? "Swapping..." : "Confirm Swap"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
