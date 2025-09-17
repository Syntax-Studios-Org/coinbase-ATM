import type { Address } from "viem";

// Session Token Types
export interface SessionTokenRequest {
  addresses: Array<{
    address: string;
    blockchains: string[];
  }>;
  assets?: string[];
}

export interface SessionTokenResponse {
  token: string;
  channel_id?: string;
}

// Onramp URL Generation Types
export interface OnrampUrlParams {
  sessionToken: string;
  fiatAmount: number;
  fiatCurrency: string;
  defaultAsset: string;
  defaultNetwork: string;
  defaultPaymentMethod?: PaymentMethod;
  destinationAddress: string;
  partnerUserId?: string;
  redirectUrl?: string;
  quoteId?: string;
}

export interface OnrampQuoteParams {
  fiatAmount: number;
  fiatCurrency: string;
  cryptoAsset: string;
  network: string;
  destinationAddress: Address;
}

// Payment Methods supported by Coinbase Onramp
export type PaymentMethod =
  | "CRYPTO_ACCOUNT"
  | "FIAT_WALLET"
  | "CARD"
  | "ACH_BANK_ACCOUNT"
  | "APPLE_PAY";

// Supported Networks
export type SupportedOnrampNetwork = "base";

// Supported Assets for Onramp
export type SupportedOnrampAsset = "USDC" | "ETH" | "WETH" | "DAI";

// Fiat Currencies
export type SupportedFiatCurrency = "USD" | "EUR" | "GBP" | "CAD";

// Onramp Configuration
export interface OnrampConfig {
  baseUrl: string;
  defaultNetwork: SupportedOnrampNetwork;
  defaultAsset: SupportedOnrampAsset;
  defaultFiatCurrency: SupportedFiatCurrency;
  defaultPaymentMethod: PaymentMethod;
  minAmount: number;
  maxAmount: number;
}

// Onramp State Management
export interface OnrampState {
  isLoading: boolean;
  error: string | null;
  sessionToken: string | null;
  onrampUrl: string | null;
  isGeneratingUrl: boolean;
}

// Onramp Request/Response Types
export interface GenerateOnrampUrlRequest {
  destinationAddress: Address;
  fiatAmount: number;
  fiatCurrency: SupportedFiatCurrency;
  cryptoAsset: SupportedOnrampAsset;
  network: SupportedOnrampNetwork;
  paymentMethod?: PaymentMethod;
}

export interface GenerateOnrampUrlResponse {
  url: string;
  sessionToken: string;
  expiresAt?: string;
}

// Error Types
export interface OnrampError {
  code: string;
  message: string;
  details?: any;
}

export interface OnrampApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

// Onramp Transaction Status (for future use)
export interface OnrampTransaction {
  id: string;
  status: OnrampTransactionStatus;
  fiatAmount: number;
  fiatCurrency: string;
  cryptoAmount: number;
  cryptoAsset: string;
  network: string;
  destinationAddress: Address;
  createdAt: string;
  updatedAt: string;
  transactionHash?: string;
}

export type OnrampTransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

// Validation Types
export interface OnrampValidationResult {
  isValid: boolean;
  errors: string[];
}

// Hook Return Types
export interface UseOnrampReturn {
  generateOnrampUrl: (
    params: GenerateOnrampUrlRequest,
  ) => Promise<string | null>;
  state: OnrampState;
  reset: () => void;
}

// Constants Types
export interface OnrampConstants {
  NETWORKS: Record<SupportedOnrampNetwork, string>;
  ASSETS: Record<SupportedOnrampAsset, string>;
  FIAT_CURRENCIES: Record<SupportedFiatCurrency, string>;
  PAYMENT_METHODS: Record<PaymentMethod, string>;
  LIMITS: {
    MIN_AMOUNT: number;
    MAX_AMOUNT: number;
  };
}

// Address formatting for session tokens
export interface FormattedAddress {
  address: string;
  blockchains: string[];
}

// Onramp URL query parameters (for manual URL construction)
export interface OnrampUrlQueryParams {
  sessionToken: string;
  defaultAsset: string;
  fiatCurrency: string;
  presetFiatAmount: string;
  defaultPaymentMethod: string;
  defaultNetwork: string;
  partnerUserId?: string;
  redirectUrl?: string;
  quoteId?: string;
}

// Onramp modal state
export interface OnrampModalState {
  isOpen: boolean;
  step: OnrampStep;
  selectedAmount: number;
  selectedCurrency: SupportedFiatCurrency;
  selectedAsset: SupportedOnrampAsset;
  selectedNetwork: SupportedOnrampNetwork;
  selectedPaymentMethod: PaymentMethod;
}

export type OnrampStep =
  | "amount"
  | "review"
  | "processing"
  | "success"
  | "error";
