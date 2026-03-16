import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestUser } from '../common/types/request-user.type';
import { AdminService } from './admin.service';
import {
  UpdateTicketDto,
  CreateTicketReplyDto,
  TicketStatus,
} from './dto/support-ticket.dto';
import {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
} from './dto/feature-flag.dto';
import {
  CreateDefaultCategoryDto,
  UpdateDefaultCategoryDto,
} from './dto/default-category.dto';
import {
  CreateAdminReportDto,
  ListAdminReportsQueryDto,
} from './dto/admin-report.dto';
import {
  CreateAdminNotificationBroadcastDto,
  ListAdminNotificationBroadcastsQueryDto,
} from './dto/admin-notification.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getAdminDashboardStats();
  }

  // ==================== USER ACTIVITY OVERVIEW ====================

  @Get('users/overview')
  async getAllUsersOverview(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllUsersOverview(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('users/:id/summary')
  async getUserActivitySummary(@Param('id') id: string) {
    return this.adminService.getUserActivitySummary(id);
  }

  // ==================== SUPPORT TICKETS ====================

  @Get('chat/recent')
  async getRecentChatMessages(@Query('limit') limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : 5;
    return this.adminService.getRecentChatMessages(
      Number.isFinite(parsed) ? parsed : 5,
    );
  }

  @Get('tickets')
  async getAllTickets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: TicketStatus,
  ) {
    return this.adminService.getAllTickets(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
    );
  }

  @Get('tickets/:id')
  async getTicketById(@Param('id') id: string) {
    return this.adminService.getTicketById(id);
  }

  @Put('tickets/:id')
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.updateTicket(id, user.sub, dto);
  }

  @Post('tickets/:id/reply')
  async replyToTicket(
    @Param('id') ticketId: string,
    @Body() dto: CreateTicketReplyDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.replyToTicket(ticketId, user.sub, dto, true);
  }

  // ==================== ADMIN LOGS ====================

  @Get('logs')
  async getAdminLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('adminId') adminId?: string,
  ) {
    return this.adminService.getAdminLogs(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      adminId,
    );
  }

  // ==================== REPORTS ====================

  @Get('reports')
  async listReports(@Query() query: ListAdminReportsQueryDto) {
    return this.adminService.listAdminReports(query);
  }

  @Post('reports')
  async createReport(
    @Body() dto: CreateAdminReportDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.createAdminReport(user.sub, dto);
  }

  @Get('reports/:id')
  async getReportById(@Param('id') id: string) {
    return this.adminService.getAdminReportById(id);
  }

  @Post('reports/:id/generate')
  async generateReport(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.generateAdminReport(id, user.sub);
  }

  // ==================== FEATURE FLAGS ====================

  @Get('feature-flags')
  async getAllFeatureFlags() {
    return this.adminService.getAllFeatureFlags();
  }

  @Post('feature-flags')
  async createFeatureFlag(
    @Body() dto: CreateFeatureFlagDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.createFeatureFlag(dto, user.sub);
  }

  @Put('feature-flags/:id')
  async updateFeatureFlag(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureFlagDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.updateFeatureFlag(id, dto, user.sub);
  }

  @Patch('feature-flags/:id/toggle')
  async toggleFeatureFlag(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.toggleFeatureFlag(id, user.sub);
  }

  @Delete('feature-flags/:id')
  async deleteFeatureFlag(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.deleteFeatureFlag(id, user.sub);
  }

  // ==================== DEFAULT CATEGORIES ====================

  @Get('default-categories')
  async getAllDefaultCategories() {
    return this.adminService.getAllDefaultCategories();
  }

  @Get('default-categories/:id')
  async getDefaultCategoryById(@Param('id') id: string) {
    return this.adminService.getDefaultCategoryById(id);
  }

  @Post('default-categories')
  async createDefaultCategory(
    @Body() dto: CreateDefaultCategoryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.createDefaultCategory(dto, user.sub);
  }

  @Put('default-categories/:id')
  async updateDefaultCategory(
    @Param('id') id: string,
    @Body() dto: UpdateDefaultCategoryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.updateDefaultCategory(id, dto, user.sub);
  }

  @Delete('default-categories/:id')
  async deleteDefaultCategory(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.deleteDefaultCategory(id, user.sub);
  }
  // ==================== NOTIFICATIONS ====================

  @Get('notifications')
  async listNotificationBroadcasts(
    @Query() query: ListAdminNotificationBroadcastsQueryDto,
  ) {
    return this.adminService.listNotificationBroadcasts(
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  @Post('notifications')
  async broadcastNotification(
    @Body() dto: CreateAdminNotificationBroadcastDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adminService.broadcastNotification(user.sub, dto);
  }
}
