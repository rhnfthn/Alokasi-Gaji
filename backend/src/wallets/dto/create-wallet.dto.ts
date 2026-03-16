import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

const walletTypes = ['CASH', 'BANK', 'EWALLET', 'CARD', 'OTHER'] as const;

export class CreateWalletDto {
  @IsString()
  name!: string;

  @IsIn(walletTypes)
  type!: (typeof walletTypes)[number];

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
