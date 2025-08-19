import { NextRequest, NextResponse } from "next/server";
import { CdpClient } from "@coinbase/cdp-sdk";
import type { Address } from "viem";
import { serverEnv } from "@/config/server.env";

interface CreateSwapQuoteRequest {
  fromToken: Address;
  toToken: Address;
  fromAmount: string;
  network: string;
  taker: Address;
  slippageBps?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSwapQuoteRequest = await request.json();
    const { fromToken, toToken, fromAmount, network, taker, slippageBps = 100 } = body;

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

    // Create swap quote from CDP
    const swapQuote = await cdp.evm.createSwapQuote({
      network: network as any,
      toToken,
      fromToken,
      fromAmount: BigInt(fromAmount),
      taker,
      slippageBps,
    });

    if (!swapQuote.liquidityAvailable) {
      return NextResponse.json(
        { error: "Insufficient liquidity for this swap" },
        { status: 400 }
      );
    }

    const response = {
      fromAmount: swapQuote.fromAmount.toString(),
      toAmount: swapQuote.toAmount.toString(),
      minToAmount: swapQuote.minToAmount.toString(),
      gas: swapQuote.transaction?.gas?.toString() || "0",
      liquidityAvailable: swapQuote.liquidityAvailable,
      transaction: {
        to: swapQuote.transaction?.to,
        data: swapQuote.transaction?.data,
        value: swapQuote.transaction?.value?.toString() || "0",
        gas: swapQuote.transaction?.gas?.toString(),
        gasPrice: swapQuote.transaction?.gasPrice?.toString(),
      },
      permit2: swapQuote.permit2 ? {
        eip712: swapQuote.permit2.eip712,
      } : null,
      fees: {
        gasFee: {
          amount: swapQuote.fees.gasFee?.amount.toString(),
          token: swapQuote.fees.gasFee?.token,
        },
        protocolFee: {
          amount: swapQuote.fees.protocolFee?.amount.toString(),
          token: swapQuote.fees.protocolFee?.token,
        }
      },
      issues: {
        allowance: swapQuote.issues?.allowance ? {
          currentAllowance: swapQuote.issues.allowance.currentAllowance.toString(),
          spender: swapQuote.issues.allowance.spender,
        } : null,
        balance: swapQuote.issues?.balance ? {
          currentBalance: swapQuote.issues.balance.currentBalance.toString(),
          requiredBalance: swapQuote.issues.balance.requiredBalance.toString(),
        } : null,
        simulationIncomplete: swapQuote.issues?.simulationIncomplete || false,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating swap quote:", error);
    return NextResponse.json(
      { error: "Failed to create swap quote" },
      { status: 500 }
    );
  }
}
