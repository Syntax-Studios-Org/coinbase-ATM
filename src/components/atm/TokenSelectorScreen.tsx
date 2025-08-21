"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import type { Token } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";
import { ATMScreen } from "./ATMContainer";
import { Input } from "@/components/ui";

interface TokenSelectorScreenProps {
  onNavigate: (screen: ATMScreen) => void;
}

export function TokenSelectorScreen({ onNavigate }: TokenSelectorScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetwork>("base");

  // Get tokens for current network
  const networkTokens = useMemo(() =>
    Object.values(SUPPORTED_NETWORKS[selectedNetwork as keyof typeof SUPPORTED_NETWORKS] || {}),
    [selectedNetwork]
  );
  const { data: balances } = useTokenBalances(selectedNetwork as SupportedNetwork, networkTokens);

  // Get available tokens for the selected network
  const availableTokens = networkTokens;

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return availableTokens;

    return availableTokens.filter(token =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableTokens, searchQuery]);

  // Get balance for a token
  const getTokenBalance = (token: Token) => {
    if (!balances) return null;
    return balances.find(
      balance =>
        balance.token.address.toLowerCase() === token.address.toLowerCase()
    );
  };

  const handleTokenSelect = (token: Token) => {
    // This would typically be handled by a parent component or context
    // For now, just navigate back to swap
    onNavigate("swap");
  };

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => onNavigate("swap")}
        className="absolute top-1.5 left-0 w-6 h-6 z-10 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="#2bc876"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="absolute top-[105px] left-[15px] w-[360px] h-[617px]">

        {/* Token selector card */}
        <div className="w-full h-[434px] rounded-[20px] overflow-hidden border-none shadow-[inset_0px_0px_14px_#00000026] bg-gradient-radial from-[#091408] to-[#050a07] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[20px] before:bg-gradient-to-br before:from-[#1e1e1e] before:to-[#3d3c3c] before:mask-composite-exclude relative">
          <div className="relative z-10 flex flex-col h-full">

            {/* Header */}
            <div className="flex flex-col items-center gap-[18px] pt-[18px] px-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-[#2bc876] font-pixelify font-semibold text-lg">
                  Select Token
                </h2>
                <div className="flex items-center gap-1">
                  <div className="text-white/50 font-['Inter'] font-semibold text-xs">
                    Network:
                  </div>
                  <div className="text-[#2bc876] font-['Inter'] font-semibold text-xs">
                    {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
                  </div>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141519] border-[#2bc87638] text-white placeholder:text-white/40 font-['Inter']"
                />
              </div>
            </div>

            {/* Network selector */}
            <div className="px-6 pb-4">
              <div className="flex gap-2">
                {Object.keys(SUPPORTED_NETWORKS).map((network) => (
                  <button
                    key={network}
                    onClick={() => setSelectedNetwork(network as SupportedNetwork)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-medium transition-colors ${
                      selectedNetwork === network
                        ? 'bg-[#2bc876] text-[#09172d]'
                        : 'bg-[#141519] text-white/60 border border-[#2bc87638] hover:border-[#2bc876]'
                    }`}
                  >
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Token list */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-2">
                {filteredTokens.map((token) => {
                  const balance = getTokenBalance(token);
                  const balanceAmount = balance
                    ? (Number(balance.balance) / Math.pow(10, token.decimals)).toFixed(6)
                    : "0.000000";

                  return (
                    <button
                      key={`${token.address}-${selectedNetwork}`}
                      onClick={() => handleTokenSelect(token)}
                      className="w-full flex items-center justify-between p-3 bg-[#141519] rounded-lg border border-[#2bc87638] hover:border-[#2bc876] hover:bg-[#2bc87610] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={`/icons/${token.symbol.toLowerCase()}.svg`}
                          alt={token.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/icons/eth.svg';
                          }}
                        />
                        <div className="text-left">
                          <div className="text-white font-['Inter'] font-medium text-sm">
                            {token.symbol}
                          </div>
                          <div className="text-white/60 font-['Inter'] text-xs">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-['Inter'] font-medium text-sm">
                          {balanceAmount}
                        </div>
                        {balance?.usdValue && (
                          <div className="text-white/60 font-['Inter'] text-xs">
                            ${balance.usdValue.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute top-[549px] left-[25px] w-[310px] flex items-center justify-around">
          <div className="text-white/32 font-['Inter'] font-medium text-[9px] text-center tracking-[2.75px] leading-[15px] mix-blend-color-dodge opacity-32">
            COLLECT YOUR CRYPTO
          </div>
        </div>

        {/* Bottom card */}
        <div className="absolute top-[575px] left-0 w-[360px] flex flex-col items-center justify-center gap-2.5 p-2 rounded-lg border-[0.7px] border-white/20">
          <div className="w-full h-[26px] rounded-[3px] border-none shadow-[inset_0px_0px_18px_#000000e6] bg-gradient-to-br from-[#1a1a1a] to-[#090909] relative">
            <div className="absolute w-px h-[11px] -top-3 left-[179px] mix-blend-color-dodge bg-white/20"></div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute w-[342px] h-[99px] top-[509px] left-[9px] bg-gradient-to-b from-transparent to-[#080808]" />
        <div className="absolute w-[342px] h-px top-[484px] left-[9px] bg-white/10" />
      </div>
    </>
  );
}
