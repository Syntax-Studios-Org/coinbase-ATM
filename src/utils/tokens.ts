import { SUPPORTED_NETWORKS, SupportedNetwork } from "@/constants/tokens";

export const getTokenSymbol = (tokenAddress: string, network: string) => {
  if (!tokenAddress) return "";

  const tokens = Object.values(
    SUPPORTED_NETWORKS[network as SupportedNetwork] || {},
  );
  const token = tokens.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
  );
  return token?.symbol || tokenAddress.slice(0, 6) + "...";
};

export const getTokenDecimals = (tokenAddress: string, network: string) => {
  if (!tokenAddress) return 18;

  const tokens = Object.values(
    SUPPORTED_NETWORKS[network as SupportedNetwork] || {},
  );
  const token = tokens.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
  );
  return token?.decimals || 18;
};
