"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatUnits } from "viem";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { SUPPORTED_NETWORKS } from "@/constants/tokens";
import type { Token } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";
import { ATMScreen } from "./ATMContainer";
import { UserHeader } from "./UserHeader";
import { useEvmAddress } from "@coinbase/cdp-hooks";

interface TokenSelectorScreenProps {
  onNavigate: (screen: ATMScreen) => void;
  onTokenSelect: (token: Token) => void;
  excludeToken?: Token | null;
  network?: SupportedNetwork;
  title?: string;
  balances?: any[];
  totalUsdBalance?: number;
  text?: string;
  icon?: string;
  onGoBack?: () => void;
  onShowPrivateKey?: () => void;
}

export function TokenSelectorScreen({
  onNavigate,
  onTokenSelect,
  excludeToken = null,
  network = "base",
  title = "Select Token",
  balances = [],
  totalUsdBalance = 0,
  text,
  icon,
  onGoBack,
  onShowPrivateKey
}: TokenSelectorScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { getVar } = useThemeStyles();
  const address = useEvmAddress()

  // Get tokens for current network
  const networkTokens = Object.values(SUPPORTED_NETWORKS[network]);

  // Filter tokens based on search query and exclude token, then sort by USD value
  const filteredTokens = useMemo(() => {
    const filtered = networkTokens.filter((token) => {
      // Filter out excluded token
      const isValidForSelection = excludeToken
        ? token.address !== excludeToken.address
        : true;

      // Filter based on search query
      const matchesSearch =
        !searchQuery ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      return isValidForSelection && matchesSearch;
    });

    // Sort by USD value in descending order
    return filtered.sort((a, b) => {
      const balanceA = balances?.find(
        (balance) => balance.token.address.toLowerCase() === a.address.toLowerCase()
      );
      const balanceB = balances?.find(
        (balance) => balance.token.address.toLowerCase() === b.address.toLowerCase()
      );

      const usdValueA = balanceA?.usdValue || 0;
      const usdValueB = balanceB?.usdValue || 0;

      return usdValueB - usdValueA; // Descending order
    });
  }, [networkTokens, searchQuery, excludeToken, balances]);

  return (
    <>
      <UserHeader
        address={address}
        isSignedIn={true}
        showGoBack={!!onGoBack}
        onGoBack={onGoBack}
        onShowPrivateKey={onShowPrivateKey}
      />
    <div className="flex flex-col h-full min-w-full py-4">
      {/* Token selection interface */}
      <div className="flex flex-col items-center gap-4 w-full flex-1">
        {/* Title text or balance display */}
        {text ? (
          <div className="w-full text-left">
            {
              icon && (
                <Image src={icon} alt='icon' width={32} height={32} className="mb-2" />
              )
            }
            <p
              className="font-pixelify text-2xl"
              style={{
                color: getVar("primary"),
              }}
            >
              {text}
            </p>
          </div>
        ) : (
          <>
            <p
              className="text-sm"
              style={{
                color: getVar("textSecondary"),
              }}
            >
              Your balance
            </p>
            <div className="flex items-start max-h-[56px] leading-none">
              <p className="font-pixelify font-normal text-2xl align-top opacity-60" style={{ color: getVar("textAccent") }}>
                $
              </p>
              <p
                className="font-pixelify font-normal text-[56px] leading-none align-top"
                style={{ color: getVar("textAccent") }}
              >
                {totalUsdBalance.toFixed(2)}
              </p>
            </div>
          </>
        )}

        {/* Search bar */}
        <div className="w-full relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Image src="/search.svg" alt="Search" width={16} height={16} />
          </div>
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none transition-colors placeholder:opacity-50"
            style={{
              color: getVar("textPrimary"),
              backgroundColor: getVar("inputBackground"),
              borderColor: getVar("inputBorder"),
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = getVar("textAccent");
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = getVar("inputBorder");
            }}
          />
        </div>

        {/* Token list */}
        <div className="w-full flex-1 overflow-y-auto max-h-[200px] scrollbar-hide">
          <div className="space-y-1">
            {filteredTokens.map((token) => {
              const balance = balances?.find(
                (b) =>
                  b.token.address.toLowerCase() === token.address.toLowerCase(),
              );
              const formattedBalance = balance
                ? parseFloat(
                    formatUnits(BigInt(balance.balance), token.decimals),
                  )
                    .toFixed(8)
                    .replace(/\.?0+$/, "")
                : "0";
              const tokenUsdValueFormatted = balance?.usdValue
                ? `$${balance.usdValue.toFixed(2)}`
                : "$0";
              return (
                <button
                  key={token.address}
                  onClick={() => onTokenSelect(token)}
                  className="cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = getVar(
                      "backgroundTertiary",
                    );
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Image
                    src={token.logoUrl!}
                    alt={token.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div
                      className="font-medium text-sm font-pixelify"
                      style={{ color: getVar("textPrimary") }}
                    >
                      {token.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: getVar("textMuted") }}
                    >
                      {formattedBalance} {token.symbol}
                    </div>
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: getVar("textPrimary") }}
                  >
                    {tokenUsdValueFormatted}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
