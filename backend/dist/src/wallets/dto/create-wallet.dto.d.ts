declare const walletTypes: readonly ["CASH", "BANK", "EWALLET", "CARD", "OTHER"];
export declare class CreateWalletDto {
    name: string;
    type: (typeof walletTypes)[number];
    balance?: number;
    currency?: string;
}
export {};
