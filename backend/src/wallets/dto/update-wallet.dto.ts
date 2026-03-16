import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

const walletTypes = ['CASH', 'BANK', 'EWALLET', 'CARD', 'OTHER'] as const;

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(walletTypes)
  type?: (typeof walletTypes)[number];

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
