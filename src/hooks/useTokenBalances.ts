import { useState, useEffect, useCallback } from "react";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { formatUnits } from "viem";
import { SWAP_CONFIG } from "@/constants/config";
import type { Token, TokenBalance, TokenBalancesApiResponse, ApiTokenBalance } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

interface PricesApiResponse {
  prices: Record<string, number | null>;
}

export const useTokenBalances = (network: SupportedNetwork, tokens: Token[]) => {
  const evmAddress = useEvmAddress();
  const [data, setData] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalUsdBalance, setTotalUsdBalance] = useState<number>(0);

  const fetchBalances = useCallback(async (): Promise<void> => {
    if (!evmAddress) {
      setData([]);
      setTotalUsdBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch balances and prices concurrently
      const [balancesResponse, pricesResponse] = await Promise.all([
        fetch("/api/balances", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: evmAddress,
            network,
          }),
        }),
        fetch("/api/prices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenIds: tokens.map(token => token.coingeckoTokenId),
          })
        })
      ]);

      if (!balancesResponse.ok) {
        throw new Error("Failed to fetch balances");
      }

      const balancesResult: TokenBalancesApiResponse = await balancesResponse.json();

      // Handle prices response - don't fail if prices fail
      let pricesResult: PricesApiResponse | null = null;
      if (pricesResponse.ok) {
        pricesResult = await pricesResponse.json();
      } else {
        console.warn("Failed to fetch prices, continuing without USD values");
      }

      let totalUsd = 0;
      const balances: TokenBalance[] = tokens.map(token => {
        const apiBalance = balancesResult.balances?.find((balance: ApiTokenBalance) =>
          balance.token.contractAddress?.toLowerCase() === token.address.toLowerCase()
        );

        // Use BigInt for precise token amounts to avoid JavaScript floating point errors
        const balance = apiBalance ? BigInt(apiBalance.amount.amount) : BigInt(0);
        const decimals = apiBalance ? apiBalance.amount.decimals : token.decimals;
        const formattedBalance = formatUnits(balance, decimals);
        const numericBalance = parseFloat(formattedBalance);

        // Calculate USD value
        const tokenPrice = pricesResult?.prices[token.coingeckoTokenId] || null;
        const usdValue = tokenPrice && numericBalance > 0 ? numericBalance * tokenPrice : 0;

        if (usdValue > 0) {
          totalUsd += usdValue;
        }

        return {
          token,
          balance,
          formattedBalance: numericBalance.toFixed(6),
          usdValue,
        };
      });

      setData(balances);
      setTotalUsdBalance(totalUsd);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balances');
      setError(error);
      console.error("Error fetching token balances:", error);

      // Set fallback data on error
      const fallbackBalances = tokens.map(token => ({
        token,
        balance: BigInt(0),
        formattedBalance: "0.000000",
        usdValue: 0,
      }));
      setData(fallbackBalances);
      setTotalUsdBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [evmAddress, network, tokens]);

  useEffect(() => {
    fetchBalances();

    // Auto-refresh token balances
    const interval = setInterval(fetchBalances, SWAP_CONFIG.BALANCE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [evmAddress, network]);

  return { data, isLoading, error, refetch: fetchBalances, totalUsdBalance };
};
