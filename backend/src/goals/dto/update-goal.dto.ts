import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  savedAmount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
