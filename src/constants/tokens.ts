import type { Token } from "@/types/swap";

// ===== Base Tokens =====
export const BASE_TOKENS: Record<string, Token> = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "/icons/eth.svg",
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "/icons/usdc.svg",
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoUrl: "/icons/weth.svg",
  },
  DAI: {
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoUrl: "/icons/dai.svg",
  },
  CBBTC: {
     address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
     symbol: "cbBTC",
     name: "Coinbase Wrapped BTC",
     decimals: 8,
     logoUrl: "/icons/cbbtc.webp",
   },
   USDT: {
     address: "0xd9AA094a6195E209aA0aE1aA099a5A46eDD4C716",
     symbol: "USDT",
     name: "Tether USD",
     decimals: 6,
     logoUrl: "/icons/usdt.svg",
   },
   ZORA: {
     address: "0x1111111111166b7fe7bd91427724b487980afc69",
     symbol: "ZORA",
     name: "ZORA",
     decimals: 18,
     logoUrl: "/icons/zora.jpg",
   },
   ZRO: {
     address: "0x6985884c4392d348587b19cb9eaaf157f13271cd",
     symbol: "ZRO",
     name: "LayerZero",
     decimals: 18,
     logoUrl: "/icons/ZRO.jpeg",
   },
   CAKE: {
     address: "0x3055913c90fcc1a6ce9a358911721eeb942013a1",
     symbol: "CAKE",
     name: "PancakeSwap",
     decimals: 18,
     logoUrl: "/icons/cake.webp",
   },
};

// ===== Ethereum Mainnet Tokens =====
export const ETHEREUM_TOKENS: Record<string, Token> = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "/icons/eth.svg",
  },
  USDC: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "/icons/usdc.svg",
  },
  WETH: {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoUrl: "/icons/weth.svg",
  },
  DAI: {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoUrl: "/icons/dai.svg",
  },
  WBTC: {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      symbol: "WBTC",
      name: "Wrapped BTC",
      decimals: 8,
      logoUrl: "/icons/wbtc.png",
    },
    LINK: {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      logoUrl: "/icons/link.svg",
    },
    UNI: {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      logoUrl: "/icons/uni.svg",
    },
    cbETH: {
      address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
      symbol: "cbETH",
      name: "Coinbase Wrapped Staked ETH",
      decimals: 18,
      logoUrl: "/icons/cbeth.png",
    },
    USDT: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoUrl: "/icons/usdt.svg",
    },
    BNB: {
      address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
      symbol: "BNB",
      name: "Binance Coin",
      decimals: 18,
      logoUrl: "/icons/bnb.webp",
    },
    SHIBA: {
      address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      symbol: "SHIBA",
      name: "Shiba Inu",
      decimals: 18,
      logoUrl: "/icons/shiba.webp",
    }
};


export const SUPPORTED_NETWORKS = {
  base: BASE_TOKENS,
  ethereum: ETHEREUM_TOKENS,
} as const;

export type SupportedNetwork = keyof typeof SUPPORTED_NETWORKS;
