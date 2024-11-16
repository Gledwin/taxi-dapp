import { createPublicClient, custom } from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { TaxiUser } from "@/entities/taxiUser";

// Define an interface for the expected return type from the contract
interface FetchedTaxiUser {
  id: string; // Adjust the type based on what your contract actually returns
  walletAddress: `0x${string}`;
  username: string;
  emailAddress: string;
  isDriver: boolean;
  isBlank: boolean;
}

export const getUserByWalletAddress = async (
  _signerAddress: `0x${string}` | undefined,
  { _walletAddress }: GetUserByWalletAddress
): Promise<TaxiUser | null> => {
  let taxiUser: TaxiUser | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celo,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedTaxiUser = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getUserByWalletAddress",
        args: [_walletAddress], // Use _walletAddress here
      }) as FetchedTaxiUser; // Use the defined interface

      taxiUser = {
        id: Number(fetchedTaxiUser.id), // Adjust if necessary
        walletAddress: fetchedTaxiUser.walletAddress,
        username: fetchedTaxiUser.username,
        emailAddress: fetchedTaxiUser.emailAddress,
        isDriver: fetchedTaxiUser.isDriver,
        isBlank: fetchedTaxiUser.isBlank,
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
