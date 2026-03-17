import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@CurrentUser() user: RequestUser) {
    return this.budgetsService.list(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  async getAnalytics(
    @CurrentUser() user: RequestUser,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const now = new Date();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    const y = year ? parseInt(year, 10) : now.getFullYear();
    return this.budgetsService.getAnalytics(user.sub, m, y);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.budgetsService.remove(user.sub, id);
  }
}
