import { NextRequest, NextResponse } from "next/server";
import { CdpClient } from "@coinbase/cdp-sdk";
import type { Address } from "viem";
import { platform } from "process";
import { serverEnv } from "@/config/server.env";

interface SwapQuoteRequest {
  fromToken: Address;
  toToken: Address;
  fromAmount: string;
  network: string;
  taker: Address;
}

export async function POST(request: NextRequest) {
  try {
    const body: SwapQuoteRequest = await request.json();
    const { fromToken, toToken, fromAmount, network, taker } = body;

    // Validate required fields
    if (!fromToken || !toToken || !fromAmount || !network || !taker) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize CDP client
    const { CDP_API_KEY_ID: apiKeyId, CDP_API_KEY_SECRET: apiKeySecret, CDP_WALLET_SECRET: walletSecret } = serverEnv;

    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      return NextResponse.json(
        { error: "CDP API keys not configured. Missing apiKeyId, apiKeySecret, or walletSecret" },
        { status: 500 }
      );
    }

    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    // Get swap price quote from CDP - includes routing, fees, and liquidity check
    const swapPrice = await cdp.evm.getSwapPrice({
      network: network as any,
      toToken,
      fromToken,
      fromAmount: BigInt(fromAmount),
      taker, // User's wallet address
    });

    if (!swapPrice.liquidityAvailable) {
      return NextResponse.json(
        { error: "Insufficient liquidity for this swap" },
        { status: 400 }
      );
    }

    const response = {
      fromAmount: swapPrice.fromAmount.toString(),
      toAmount: swapPrice.toAmount.toString(),
      minToAmount: swapPrice.minToAmount.toString(),
      gas: (swapPrice.gas || 0n).toString(),
      gasPrice: (swapPrice.gasPrice || 0n).toString(),
      liquidityAvailable: swapPrice.liquidityAvailable,
      issues: {
        allowance: swapPrice.issues?.allowance ? {
          currentAllowance: swapPrice.issues.allowance.currentAllowance.toString(),
          spender: swapPrice.issues.allowance.spender,
        } : null,
        balance: swapPrice.issues?.balance ? {
          currentBalance: swapPrice.issues.balance.currentBalance.toString(),
          requiredBalance: swapPrice.issues.balance.requiredBalance.toString(),
        } : null,
        simulationIncomplete: swapPrice.issues?.simulationIncomplete || false,
      },
      fees: {
        gasFee: {
          amount: swapPrice.fees.gasFee?.amount.toString(),
          token: swapPrice.fees.gasFee?.token,
        },
        protocolFee: {
          amount: swapPrice.fees.protocolFee?.amount.toString(),
          token: swapPrice.fees.protocolFee?.token,
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting swap quote:", error);
    return NextResponse.json(
      { error: "Failed to get swap quote" },
      { status: 500 }
    );
  }
}
