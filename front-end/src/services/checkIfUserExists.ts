import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const checkIfUserExists = async (
  _signerAddress: `0x${string}` | undefined
): Promise<boolean> => {
  if (window.ethereum) {
    try {
      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });
      try {
        const userExists = await publicClient.readContract({
          address: taxiContractAddress as `0x${string}`,
          abi: taxiContractABI,
          functionName: "checkIfUserExists",
          args: [_signerAddress],
        });
        return userExists as boolean;
      } catch (err) {
        console.error(err);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};
