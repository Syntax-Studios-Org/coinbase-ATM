"use client";

import { useState, useMemo, useCallback } from "react";
import { formatUnits, parseUnits } from "viem";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useSwap } from "@/hooks/useSwap";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import type { SupportedNetwork } from "@/constants/tokens";
import { getTokenDecimals, getTokenSymbol } from "@/utils/tokens";
import { TokenSelectorScreen } from "./TokenSelectorScreen";
import { ATMButton } from "@/components/ui/ATMButton";
import { UserHeader } from "./UserHeader";
import Image from "next/image";
import { useThemeStyles } from "@/hooks/useThemeStyles";

interface SwapScreenProps {
  onNavigate: () => void;
  onSwapComplete?: (transactionHash: string, tokenData?: {
    fromToken: any;
    toToken: any;
    fromAmount: string;
    toAmount: string;
  }) => void;
}

export function SwapScreen({ onNavigate, onSwapComplete }: SwapScreenProps) {
  const evmAddress = useEvmAddress();
  const [selectingToToken, setSelectingToToken] = useState(false);
  const [slippage, setSlippage] = useState(5); // 5% default slippage
  const { getVar } = useThemeStyles();

  const {
    fromToken,
    toToken,
    fromAmount,
    network,
    setFromToken,
    setToToken,
    setFromAmount,
    priceData,
    isPriceLoading,
    priceError,
    createQuote,
    executeSwap,
    isExecutionLoading,
  } = useSwap();

  // Get tokens for current network
  const networkTokens = useMemo(
    () =>
      Object.values(
        SUPPORTED_NETWORKS[network as keyof typeof SUPPORTED_NETWORKS] || {},
      ),
    [network],
  );
  const { data: balances, totalUsdBalance } = useTokenBalances(
    network as SupportedNetwork,
    networkTokens,
  );

  // Get balance for from token
  const fromTokenBalance = useMemo(() => {
    if (!fromToken || !balances) return null;
    return balances.find(
      (balance) =>
        balance.token.address.toLowerCase() === fromToken.address.toLowerCase(),
    );
  }, [fromToken, balances]);

  // Handle max button click
  const handleMaxClick = useCallback(() => {
    if (!fromToken || !fromTokenBalance) return;

    const decimals = getTokenDecimals(fromToken.address, network);
    const maxAmount = formatUnits(BigInt(fromTokenBalance.balance), decimals);
    setFromAmount(maxAmount);
  }, [fromToken, fromTokenBalance, network, setFromAmount]);

  // Handle token swap (flip from/to)
  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount("");
  }, [fromToken, toToken, setFromToken, setToToken, setFromAmount]);

  // Handle swap execution
  const handleSwap = async () => {
    if (!priceData || !fromToken || !toToken || !evmAddress) return;

    try {
      const swapQuote = await createQuote({
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAmount: parseUnits(fromAmount, fromToken.decimals),
        network,
        taker: evmAddress,
        slippageBps: slippage * 100 || 100
      });

      if (swapQuote) {
        const tokenData = {
          fromToken,
          toToken,
          fromAmount,
          toAmount: priceData ? formatUnits(BigInt(priceData.toAmount), toToken.decimals) : "0"
        };

        if (onSwapComplete) {
          onSwapComplete("", tokenData);
        }

        const result = await executeSwap({
          swapQuote,
          fromTokenAddress: fromToken.address,
          network,
        });

        if (result?.transactionHash && onSwapComplete) {
          onSwapComplete(result.transactionHash, tokenData);
        }
      }
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  // Check if swap is ready
  const isSwapReady =
    fromToken && toToken && fromAmount && priceData && !priceError;

  // Calculate if user has sufficient balance
  const hasSufficientBalance = useMemo(() => {
    if (!fromToken || !fromTokenBalance || !fromAmount) return true;

    // Validate and normalize the amount
    const numericAmount = parseFloat(fromAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) return true;

    const decimals = getTokenDecimals(fromToken.address, network);
    const requiredAmount = parseUnits(numericAmount.toString(), decimals);
    return BigInt(fromTokenBalance.balance) >= requiredAmount;
  }, [fromToken, fromTokenBalance, fromAmount, network]);

  return (
    <>
      {!fromToken || selectingToToken ? (
        /* Token selection interface */
        <TokenSelectorScreen
          onNavigate={onNavigate}
          onTokenSelect={(token) => {
            if (selectingToToken) {
              setToToken(token);
              setSelectingToToken(false);
            } else {
              setFromToken(token);
            }
          }}
          excludeToken={selectingToToken ? fromToken : null}
          network={network as SupportedNetwork}
          text={
            selectingToToken ? "Select Token to Buy" : "Select Token to Sell"
          }
          balances={balances}
          totalUsdBalance={totalUsdBalance}
          icon="/swap-page-icon.svg"
          onGoBack={() => setSelectingToToken(false)}
        />
      ) : (
        /* Swap interface */
        <div className="flex flex-col h-full">
          <UserHeader
            address={evmAddress}
            isSignedIn={!!evmAddress}
            showSettings={true}
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
          <div className="mb-6 mt-2">
            <p className="text-white/30 text-sm mb-3">You're trading</p>
            <div className="flex items-center gap-3 w-full justify-between">
              <button
                onClick={() => {
                  setFromToken(null);
                  setToToken(null);
                  setSelectingToToken(false);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-[#2BC876] rounded-full hover:bg-[#25b369] transition-colors"
              >
                <Image
                  src={fromToken.logoUrl!}
                  alt={fromToken.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-black font-medium text-sm font-pixelify">
                  {fromToken.symbol}
                </span>
              </button>

              {/* Exchange icon */}
              <Image
                src="/exchange.svg"
                alt="Exchange"
                width={16}
                height={16}
                className="cursor-pointer"
                onClick={handleSwapTokens}
              />

              {/* To token pill */}
              {toToken ? (
                <button
                  onClick={() => setSelectingToToken(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-[#2BC876] rounded-full hover:bg-[#2BC876]/10 transition-colors"
                >
                  <Image
                    src={toToken.logoUrl!}
                    alt={toToken.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-[#2BC876] font-medium text-sm">
                    {toToken.symbol}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectingToToken(true)}
                  className="relative px-3 py-2 rounded-full text-[#2BC876] font-medium text-sm flex items-center gap-1 font-pixelify bg-[#2BC876]/20"
                >
                  <span>Select token</span>
                  <Image
                    src="/chevron-down.svg"
                    width={14}
                    height={14}
                    alt="down"
                  />

                  {/* Border overlay */}
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: "1px dashed transparent",
                      borderRadius: "9999px",
                      background:
                        "repeating-linear-gradient(90deg, #2BC876 0 12px, transparent 12px 24px)",
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "1px",
                    }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Amount input */}
          <div className="flex-col items-center justify-around my-auto">
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="text-[#2BC876] w-full text-center bg-transparent border-none outline-none text-[56px] leading-[50px] tracking-[2%] font-pixelify font-normal placeholder-[#2BC876]/40"
              />
            </div>

            {/* Available balance with MAX button */}
            {fromTokenBalance && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-white/60 text-xs">
                  Avl: ${fromTokenBalance.usdValue?.toFixed(2) || "0.00"}
                </span>
                <span className="text-white/60 text-xs">•</span>
                <button
                  onClick={handleMaxClick}
                  className="text-xs font-pixelify"
                  style={{ color: getVar("textAccent") }}
                >
                  MAX
                </button>
              </div>
            )}
          </div>

          {/* Bottom info */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60 uppercase">Slippage</span>
              <span className="text-white">{slippage}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60 uppercase">Transaction fee</span>
              <span className="text-white">
                {priceData?.fees ? (
                  <>
                    {priceData.fees.protocolFee && (
                      <>
                        {formatUnits(
                          BigInt(priceData.fees.protocolFee.amount || "0"),
                          getTokenDecimals(
                            priceData.fees.protocolFee.token,
                            network,
                          ),
                        )}{" "}
                        {getTokenSymbol(
                          priceData.fees.protocolFee.token,
                          network,
                        )}
                      </>
                    )}
                  </>
                ) : (
                  "0.00"
                )}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60 uppercase">Network</span>
              <span className="text-[#2ac876]">Base</span>
            </div>
          </div>
        </div>
      )}

      {/* ATM Button */}
      <div className="mt-4 w-full">
        <ATMButton
          onClick={() => {
            if (!fromToken || selectingToToken) {
              // Token selection is handled by the token list interface
              return;
            } else if (!toToken) {
              // Open to token selector
              setSelectingToToken(true);
            } else if (priceData) {
              // Execute swap
              handleSwap();
            }
          }}
          disabled={
            isPriceLoading ||
            (fromToken && toToken && !hasSufficientBalance) ||
            isExecutionLoading
          }
          isLoading={isExecutionLoading}
        >
          {!fromToken
            ? "Select Token"
            : selectingToToken
              ? "Select Token"
              : !toToken
                ? "Select Token"
                : isPriceLoading
                  ? "Getting Quote..."
                  : !hasSufficientBalance
                    ? "Insufficient Balance"
                    : !isSwapReady
                      ? "Enter Amount"
                      : "Trade"}
        </ATMButton>
      </div>
    </>
  );
}
