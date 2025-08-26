export const APP_CONFIG = {
  name: "Coinbase ATM trade",
  description: "A production-ready trade UI built with Coinbase Developer Platform",
  version: "1.0.0",
  author: "Coinbase Developer Platform",
} as const;

export const API_CONFIG = {
  retryAttempts: 3,
  timeout: 10000,
  staleTime: 60 * 1000, // 1 minute
} as const;

export const SWAP_CONFIG = {
  PRICE_REFRESH_INTERVAL: 10 * 1000, // 10 seconds - auto-refresh swap quotes
  BALANCE_REFRESH_INTERVAL: 30 * 1000, // 30 seconds - auto-refresh token balances
  DEFAULT_SLIPPAGE_BPS: 100, // 1% slippage tolerance
} as const;

export const VALIDATION_CONFIG = {
  otpLength: 6,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const BASE_CHAIN = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
} as const;

export const ETHEREUM_CHAIN = {
  id: 1,
  name: "Ethereum",
  network: "mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://eth.llamarpc.com"] },
    public: { http: ["https://eth.llamarpc.com"] },
  },
} as const;


export const TRANSACTION_CONFIG = {
  confirmationTimeout: 60000, // 60 seconds
} as const;

export const NETWORKS: Record<
  string,
  { name: string; logoUrl: string; explorerUrl: string }
> = {
  Base: {
    name: "Base",
    logoUrl: "/icons/base.svg",
    explorerUrl: "https://basescan.org",
  },
  Ethereum: {
    name: "Ethereum",
    logoUrl: "/icons/eth.svg",
    explorerUrl: "https://etherscan.io",
  },
} as const;
