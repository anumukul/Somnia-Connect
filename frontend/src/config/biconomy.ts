import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { ethers } from "ethers";

export const createBiconomyAccount = async (provider: any, userAddress: string) => {
  const bundlerUrl = "https://bundler.biconomy.io/api/v2/50312/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"; // Somnia testnet bundler
  const paymasterUrl = "https://paymaster.biconomy.io/api/v1/50312/Tpk8nuCZ9.70bd3aad-a111-48ec-a954-551c17f6ab91"; // Somnia testnet paymaster

  try {
    const smartAccount = await createSmartAccountClient({
      signer: provider.getSigner(),
      biconomyPaymasterApiKey: "Tpk8nuCZ9.70bd3aad-a111-48ec-a954-551c17f6ab91",
      bundlerUrl: bundlerUrl,
      rpcUrl: "https://dream-rpc.somnia.network",
      chainId: 50312,
    });

    return smartAccount;
  } catch (error) {
    console.error("Error creating Biconomy account:", error);
    throw error;
  }
};