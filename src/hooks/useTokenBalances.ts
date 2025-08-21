import { useState, useEffect, useCallback } from "react";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { formatUnits } from "viem";
import { SWAP_CONFIG } from "@/constants/config";
import type { Token, TokenBalance, TokenBalancesApiResponse, ApiTokenBalance } from "@/types/swap";
import type { SupportedNetwork } from "@/constants/tokens";

export const useTokenBalances = (network: SupportedNetwork, tokens: Token[]) => {
  const evmAddress = useEvmAddress();
  const [data, setData] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = useCallback(async (): Promise<void> => {
    if (!evmAddress) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: evmAddress,
          network,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balances");
      }

      const result: TokenBalancesApiResponse = await response.json();

      const balances: TokenBalance[] = tokens.map(token => {
        const apiBalance = result.balances?.find((balance: ApiTokenBalance) =>
          balance.token.contractAddress?.toLowerCase() === token.address.toLowerCase()
        );

        // Use BigInt for precise token amounts to avoid JavaScript floating point errors
        const balance = apiBalance ? BigInt(apiBalance.amount.amount) : BigInt(0);
        const decimals = apiBalance ? apiBalance.amount.decimals : token.decimals;
        const formattedBalance = formatUnits(balance, decimals);

        return {
          token,
          balance,
          formattedBalance: parseFloat(formattedBalance).toFixed(6),
        };
      });

      setData(balances);
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
    } finally {
      setIsLoading(false);
    }
  }, [evmAddress, network, tokens]);

  useEffect(() => {
    fetchBalances();
    
    // Auto-refresh token balances
    const interval = setInterval(fetchBalances, SWAP_CONFIG.BALANCE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [evmAddress, network, tokens]);

  return { data, isLoading, error, refetch: fetchBalances };
};
