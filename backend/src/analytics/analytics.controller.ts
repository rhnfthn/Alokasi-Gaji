import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('overview')
  async overview(
    @CurrentUser() user: RequestUser,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.analyticsService.overview(
      user.sub,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('spending-category')
  async spendingCategory(
    @CurrentUser() user: RequestUser,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.analyticsService.spendingByCategory(
      user.sub,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('income-expense')
  async incomeExpense(
    @CurrentUser() user: RequestUser,
    @Query('monthsBack') monthsBack?: string,
  ) {
    return this.analyticsService.incomeVsExpense(
      user.sub,
      monthsBack ? Number(monthsBack) : 6,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('monthly-trend')
  async monthlyTrend(
    @CurrentUser() user: RequestUser,
    @Query('monthsBack') monthsBack?: string,
  ) {
    return this.analyticsService.monthlyTrend(
      user.sub,
      monthsBack ? Number(monthsBack) : 6,
    );
  }
}
