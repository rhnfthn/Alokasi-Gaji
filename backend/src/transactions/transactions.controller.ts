import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { TransactionType } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { ImportTransactionsDto } from './dto/import-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @CurrentUser() user: RequestUser,
    @Query('walletId') walletId?: string,
    @Query('type') type?: TransactionType,
  ) {
    return this.transactionsService.list(user.sub, { walletId, type });
  }

  @UseGuards(JwtAuthGuard)
  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  async exportCsv(@CurrentUser() user: RequestUser) {
    return this.transactionsService.exportCsv(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import/csv')
  async importCsv(
    @CurrentUser() user: RequestUser,
    @Body() dto: ImportTransactionsDto,
  ) {
    return this.transactionsService.importCsv(user.sub, dto.csv);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.transactionsService.get(user.sub, id);
  }
}
