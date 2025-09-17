interface ClientEnv {
  CDP_PROJECT_ID: string;
  REDIRECT_URL: string;
}

function validateClientEnv(): ClientEnv {
  const cdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;

  if (!cdpProjectId) {
    throw new Error('NEXT_PUBLIC_CDP_PROJECT_ID is required');
  }

  if (!redirectUrl) {
    throw new Error('NEXT_PUBLIC_REDIRECT_URL is required');
  }

  return {
    CDP_PROJECT_ID: cdpProjectId,
    REDIRECT_URL: redirectUrl,
  };
}

export const clientEnv = validateClientEnv();
