import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { TaxiUser} from "@/entities/taxiUser";

export const getUserByWalletAddress = async (
  _signerAddress: `0x${string}` | undefined,
  { _walletAddress }: GetUserByWalletAddress
): Promise<TaxiUser | null> => {
  let taxiUser: TaxiUser | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedTaxiUser = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getUserByWalletAddress",
        args: [_signerAddress],
      }) as any;

      taxiUser = {
        id: Number(fetchedTaxiUser["id"]),
        walletAddress: fetchedTaxiUser["walletAddress"],
        username: fetchedTaxiUser["username"],
        emailAddress: fetchedTaxiUser["emailAddress"],
        isDriver: fetchedTaxiUser["isDriver"],
        isBlank: fetchedTaxiUser["isBlank"]
      };
      
      return taxiUser;
    } catch (err) {
      console.info(err);
      return taxiUser;
    }
  }
  return null;
};

export type GetUserByWalletAddress = {
  _walletAddress: `0x${string}`;
};
