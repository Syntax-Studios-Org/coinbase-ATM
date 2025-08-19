import { createPublicClient, http, type PublicClient } from "viem";
import { BASE_CHAIN, TRANSACTION_CONFIG } from "@/constants/config";

/**
 * Create a public client for Base network
 * @returns PublicClient configured for Base network
 */
export const createBasePublicClient = (): PublicClient => {
  return createPublicClient({
    chain: BASE_CHAIN,
    transport: http(),
  });
};

/**
 * Wait for transaction confirmation on the blockchain
 * @param publicClient - The public client to use for confirmation
 * @param transactionHash - The transaction hash to wait for
 * @param description - Description of the transaction for logging
 */
export const waitForTransactionConfirmation = async (
  publicClient: PublicClient,
  transactionHash: string,
  description: string,
): Promise<void> => {
  console.log(`Waiting for ${description} confirmation...`);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
    timeout: TRANSACTION_CONFIG.confirmationTimeout,
  });

  console.log(`${description} confirmed in block ${receipt.blockNumber} ✅`);
};
