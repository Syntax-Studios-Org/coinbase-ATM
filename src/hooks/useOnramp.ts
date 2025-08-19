import { useState, useCallback } from "react";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { OnrampService } from "@/services/onramp.service";
import type {
  GenerateOnrampUrlRequest,
  OnrampState,
  UseOnrampReturn,
} from "@/types/onramp";

export const useOnramp = (): UseOnrampReturn => {
  const evmAddress = useEvmAddress();

  const [state, setState] = useState<OnrampState>({
    isLoading: false,
    error: null,
    sessionToken: null,
    onrampUrl: null,
    isGeneratingUrl: false,
  });

  const generateOnrampUrl = useCallback(
    async (params: GenerateOnrampUrlRequest): Promise<string | null> => {
      if (!evmAddress) {
        throw new Error("Wallet address not available");
      }

      setState((prev) => ({
        ...prev,
        isGeneratingUrl: true,
        error: null,
      }));

      try {
        // Validate parameters
        const isValid = OnrampService.validateOnrampParams({
          fiatAmount: params.fiatAmount,
          fiatCurrency: params.fiatCurrency,
          cryptoAsset: params.cryptoAsset,
          network: params.network,
          destinationAddress: evmAddress,
        });

        if (!isValid) {
          throw new Error("Invalid onramp parameters");
        }

        // Generate onramp URL for the specified asset
        const url = await OnrampService.generateOnrampUrl(
          evmAddress,
          params.fiatAmount,
          params.cryptoAsset,
          params.network,
          params.fiatCurrency
        );

        if (!url) {
          throw new Error("Failed to generate onramp URL");
        }

        setState((prev) => ({
          ...prev,
          onrampUrl: url,
          isGeneratingUrl: false,
          error: null,
        }));

        return url;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to generate onramp URL";
        setState((prev) => ({
          ...prev,
          isGeneratingUrl: false,
          error: errorMessage,
          onrampUrl: null,
        }));
        console.error("Failed to generate onramp URL:", error);
        return null;
      }
    },
    [evmAddress],
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      sessionToken: null,
      onrampUrl: null,
      isGeneratingUrl: false,
    });
  }, []);

  return {
    generateOnrampUrl,
    state,
    reset,
  };
};
