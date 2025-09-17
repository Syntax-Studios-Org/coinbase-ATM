import { NextRequest, NextResponse } from "next/server";
import { CdpClient } from "@coinbase/cdp-sdk";
import type { Address } from "viem";
import { serverEnv } from "@/config/server.env";

interface BalancesRequest {
  address: Address;
  network: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BalancesRequest = await request.json();
    const { address, network } = body;

    // Validate required fields
    if (!address || !network) {
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

    // Fetch balances from CDP
    const result = await cdp.evm.listTokenBalances({
      address,
      network: network as any,
    });

    const serializedBalances = result.balances.map(balance => ({
      token: {
        contractAddress: balance.token.contractAddress,
        network: balance.token.network,
        symbol: balance.token.symbol,
        name: balance.token.name,
      },
      amount: {
        amount: balance.amount.amount.toString(), // Converting BigInt to string
        decimals: balance.amount.decimals,
      }
    }));

    return NextResponse.json({
      balances: serializedBalances,
      nextPageToken: result.nextPageToken,
    });
  } catch (error) {
    console.error("Error fetching balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch balances" },
      { status: 500 }
    );
  }
}
