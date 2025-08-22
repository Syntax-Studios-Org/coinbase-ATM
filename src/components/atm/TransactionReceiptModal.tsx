"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Token } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  network: SupportedNetwork;
  transactionHash?: string;
  isExecuting?: boolean;
}

export function TransactionReceiptModal({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  network,
  transactionHash,
  isExecuting = false,
}: TransactionReceiptModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [receiptHeight, setReceiptHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Start the receipt printing animation
      setTimeout(() => setReceiptHeight(550), 50);
    } else {
      setIsAnimating(false);
      setReceiptHeight(0);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setReceiptHeight(0);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    };
    return now.toLocaleDateString("en-US", options);
  };

  const getExplorerUrl = () => {
    if (!transactionHash) return null;

    const explorerUrls = {
      base: "https://basescan.org/tx/",
      ethereum: "https://etherscan.io/tx/",
      arbitrum: "https://arbiscan.io/tx/",
      optimism: "https://optimistic.etherscan.io/tx/",
    };

    return explorerUrls[network] + transactionHash;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute left-1/2 overflow-hidden z-50`}
      style={{
        width: "342px",
        transform: "translateX(calc(-50%))",
        bottom: "20px",
        backgroundImage: `linear-gradient(0deg, rgba(1, 0, 1, 0.8), rgba(1, 0, 1, 0.8)), url('/review-txn-modal-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "20px 20px 0 0",
        height: `${receiptHeight}px`,
        transition: "height 800ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isAnimating ? 1 : 0,
        boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.3)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Content */}
      <div className="p-6 text-white h-[550px] flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-white/50">
            Review transaction
          </p>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Token Exchange Visual */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative flex items-center">
            {/* From Token */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-gray-800">
              {fromToken?.logoUrl ? (
                <Image
                  src={fromToken.logoUrl}
                  alt={fromToken.symbol}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                  {fromToken?.symbol}
                </div>
              )}
            </div>

            {/* To Token */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-gray-800">
              {toToken?.logoUrl ? (
                <Image
                  src={toToken.logoUrl}
                  alt={toToken.symbol}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                  {toToken?.symbol}
                </div>
              )}
            </div>

            {/* Exchange Icon */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src="/exchange-white.svg"
                alt="Exchange"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>

        {/* Swap Description */}
        <div className="text-center mb-8">
          <p className="text-[#2BC876] font-pixelify text-xl">
            You're swapping {fromAmount} {fromToken?.symbol} to {toAmount}{" "}
            {toToken?.symbol}
          </p>
        </div>

        {/* Combined Transaction Status & Action */}
        <div
          className={`mb-6 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            transactionHash
              ? "border-[#2BC876]/30 hover:bg-[#2BC876]/20"
              : "border-white/20"
          }`}
          style={{
            backgroundColor: transactionHash ? '#2BC8761A' : 'rgba(255, 255, 255, 0.2)'
          }}
          onClick={() => {
            if (transactionHash) {
              const url = getExplorerUrl();
              if (url) window.open(url, "_blank");
            }
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left side - Status with optional spinner */}
            <div className="flex items-center gap-3">
              {!transactionHash && isExecuting && (
                <div className="w-4 h-4">
                  <Image
                    src="/spinner.svg"
                    alt="Loading"
                    width={16}
                    height={16}
                    className="animate-spin"
                  />
                </div>
              )}
              <p
                className={`text-[13px] ${
                  transactionHash ? "text-[#2BC876]" : "text-gray-400"
                }`}
              >
                {transactionHash
                  ? "Transaction Completed"
                  : "Transaction Submitted"}
              </p>
            </div>

            {/* Right side - Action icons */}
            <div className="flex items-center gap-2">
              {transactionHash && (
                <>
                  {/*<Image
                    src="/check-tick-double.svg"
                    alt="Success"
                    width={18}
                    height={10}
                  />*/}
                  <Image
                    src="/external-link-square.svg"
                    alt="Open in explorer"
                    width={16}
                    height={16}
                    className="opacity-60"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center my-4">
          <Image
            src="/bar-code.svg"
            alt="Barcode"
            width={320}
            height={100}
            className={transactionHash ? "opacity-100" : "opacity-50"}
          />
        </div>
        <p className="text-xs text-white/60 text-center">{getCurrentDateTime()}</p>
      </div>
    </div>
  );
}
