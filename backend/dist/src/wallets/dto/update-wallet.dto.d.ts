declare const walletTypes: readonly ["CASH", "BANK", "EWALLET", "CARD", "OTHER"];
export declare class UpdateWalletDto {
    name?: string;
    type?: (typeof walletTypes)[number];
    balance?: number;
    currency?: string;
}
export {};
