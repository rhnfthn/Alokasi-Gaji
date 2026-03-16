import { IsString } from 'class-validator';

export class ImportTransactionsDto {
  @IsString()
  csv!: string;
}
