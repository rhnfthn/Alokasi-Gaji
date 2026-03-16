import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  walletId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  category!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
