import { createPublicClient, createWalletClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const createUser = async (
    _signerAddress: `0x${string}` | undefined, 
    { _username, _emailAddress, _isDriver }: CreateUserProps
): Promise<boolean> => {
    if (window.ethereum) {
        try {
            const privateClient = createWalletClient({
                chain: celoAlfajores,
                transport: custom(window.ethereum),
            });
            const publicClient = createPublicClient({
                chain: celoAlfajores,
                transport: custom(window.ethereum),
            });
            const [address] = await privateClient.getAddresses();
            
            try {
                const createUserTxnHash = await privateClient.writeContract({
                    account: address,
                    address: taxiContractAddress,
                    abi: taxiContractABI,
                    functionName: "createUser",
                    args: [_username, _emailAddress, _isDriver], // Add isDriver flag
                });

                const createUserTxnReceipt = await publicClient.waitForTransactionReceipt({
                    hash: createUserTxnHash,
                });

                if (createUserTxnReceipt.status == "success") {
                    return true;
                }
                return false;
            } catch (err) {
                console.error(err);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    return false;
};

// TypeScript type for `createUser` arguments
export type CreateUserProps = {
    _username: string;
    _emailAddress: string;
    _isDriver: boolean; // Add this to specify if the user is a driver or passenger
};
