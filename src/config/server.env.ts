interface ServerEnv {
  CDP_API_KEY_ID: string;
  CDP_API_KEY_SECRET: string;
  CDP_WALLET_SECRET: string;
  COINGECKO_BASE_URL: string;
  COINGECKO_API_KEY: string;
  COINGECKO_AUTH_HEADER: string;
}

function validateServerEnv(): ServerEnv {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;
  const walletSecret = process.env.CDP_WALLET_SECRET;

  const coingeckoBaseUrl = process.env.COINGECKO_BASE_URL;
  const coingeckoApiKey = process.env.COINGECKO_API_KEY;
  const coingeckoAuthHeader = process.env.COINGECKO_AUTH_HEADER;

  if (!apiKeyId) {
    throw new Error('CDP_API_KEY_ID is required');
  }

  if (!apiKeySecret) {
    throw new Error('CDP_API_KEY_SECRET is required');
  }

  if (!walletSecret) {
    throw new Error('CDP_WALLET_SECRET is required');
  }

  if (!coingeckoBaseUrl) {
    throw new Error('COINGECKO_BASE_URL is required');
  }

  if (!coingeckoApiKey) {
    throw new Error('COINGECKO_API_KEY is required');
  }

  if (!coingeckoAuthHeader) {
    throw new Error('COINGECKO_AUTH_HEADER is required');
  }

  return {
    CDP_API_KEY_ID: apiKeyId,
    CDP_API_KEY_SECRET: apiKeySecret,
    CDP_WALLET_SECRET: walletSecret,
    COINGECKO_BASE_URL: coingeckoBaseUrl,
    COINGECKO_API_KEY: coingeckoApiKey,
    COINGECKO_AUTH_HEADER: coingeckoAuthHeader,
  };
}

export const serverEnv = validateServerEnv();
