interface ServerEnv {
  CDP_API_KEY_ID: string;
  CDP_API_KEY_SECRET: string;
  CDP_WALLET_SECRET: string;
}

function validateServerEnv(): ServerEnv {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;
  const walletSecret = process.env.CDP_WALLET_SECRET;

  if (!apiKeyId) {
    throw new Error('CDP_API_KEY_ID is required');
  }

  if (!apiKeySecret) {
    throw new Error('CDP_API_KEY_SECRET is required');
  }

  if (!walletSecret) {
    throw new Error('CDP_WALLET_SECRET is required');
  }

  return {
    CDP_API_KEY_ID: apiKeyId,
    CDP_API_KEY_SECRET: apiKeySecret,
    CDP_WALLET_SECRET: walletSecret,
  };
}

export const serverEnv = validateServerEnv();
