import type { Address } from "viem";

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  coingeckoTokenId: string;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: bigint;
  toAmount: bigint;
  minToAmount: bigint;
  fees: SwapFees;
  gas: bigint;
  gasPrice: bigint;
  liquidityAvailable: boolean;
  route?: string[];
  issues?: SwapIssues;
}

export interface SwapParams {
  fromToken: Address;
  toToken: Address;
  fromAmount: bigint;
  network: string;
  taker: Address;
}

export interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  quote: SwapQuote | null;
  isLoading: boolean;
  error: string | null;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  formattedBalance: string;
  usdValue?: number;
}

// EIP-712 typed data structures
export interface EIP712Domain {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: Address;
  salt?: string;
}

export interface EIP712Types {
  [key: string]: Array<{
    name: string;
    type: string;
  }>;
}

export interface EIP712Message {
  [key: string]: any;
}

export interface Permit2Data {
  eip712: {
    domain: EIP712Domain;
    types: EIP712Types;
    primaryType: string;
    message: EIP712Message;
  };
}

export interface AllowanceIssue {
  currentAllowance: string;
  spender: Address;
  requiredAllowance: string;
}

export interface BalanceIssue {
  currentBalance: string;
  requiredBalance: string;
  token: Address;
}

export interface SwapIssues {
  allowance?: AllowanceIssue;
  balance?: BalanceIssue;
  simulationIncomplete: boolean;
}

export interface SwapTransaction {
  to: Address;
  data: string;
  value: string;
  gas?: string;
  gasPrice?: string;
}

export interface SwapFee {
  amount: string;
  token: string;
}

export interface SwapFees {
  gasFee?: SwapFee;
  protocolFee?: SwapFee;
}

export interface SwapQuoteResponse {
  fromAmount: string;
  toAmount: string;
  minToAmount: string;
  gas: string;
  liquidityAvailable: boolean;
  transaction: SwapTransaction;
  permit2?: Permit2Data | null;
  fees?: SwapFees | null;
  issues: SwapIssues;
}

export interface SwapExecutionData {
  transaction: {
    to: Address;
    data: `0x${string}`;
    value: bigint;
    gas?: bigint;
    gasPrice?: bigint;
  };
  permit2Signature?: `0x${string}`;
}

// API Response types for token balances
export interface ApiTokenAmount {
  amount: string;
  decimals: number;
}

export interface ApiTokenInfo {
  contractAddress?: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface ApiTokenBalance {
  token: ApiTokenInfo;
  amount: ApiTokenAmount;
}

export interface TokenBalancesApiResponse {
  balances: ApiTokenBalance[];
}
