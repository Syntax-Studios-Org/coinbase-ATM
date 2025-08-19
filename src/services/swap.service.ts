import { SWAP_CONFIG } from "@/constants/config";
import type { SwapParams, SwapQuote, Token } from "@/types/swap";

export class SwapService {
  static async getSwapPrice(params: SwapParams): Promise<SwapQuote | null> {
    try {
      const response = await fetch("/api/swap/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromToken: params.fromToken,
          toToken: params.toToken,
          fromAmount: params.fromAmount.toString(),
          network: params.network,
          taker: params.taker,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get swap quote");
      }

      const data = await response.json();

      return {
        fromToken: {} as Token,
        toToken: {} as Token,
        fromAmount: BigInt(data.fromAmount),
        toAmount: BigInt(data.toAmount),
        minToAmount: BigInt(data.minToAmount),
        gas: BigInt(data.gas),
        gasPrice: BigInt(data.gasPrice),
        liquidityAvailable: data.liquidityAvailable,
        fees: data.fees,
        issues: data.issues,
      };
    } catch (error) {
      console.error("Error getting swap price:", error);
      return null;
    }
  }

  static async createSwapQuote(params: SwapParams & { slippageBps?: number }) {
    try {
      const response = await fetch("/api/swap/create-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromToken: params.fromToken,
          toToken: params.toToken,
          fromAmount: params.fromAmount.toString(),
          network: params.network,
          taker: params.taker,
          slippageBps: params.slippageBps || SWAP_CONFIG.DEFAULT_SLIPPAGE_BPS,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create swap quote");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating swap quote:", error);
      throw error;
    }
  }
}
