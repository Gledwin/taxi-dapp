
export type Payment = {
    paidAt: number;
    id: number;
    rideId: number;
    passengerWalletAddress: `0x${string}`;
    amountPaidInEthers: number;
    isBlank: boolean;
   
}