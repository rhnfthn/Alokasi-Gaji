"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
const support_ticket_dto_1 = require("./dto/support-ticket.dto");
const feature_flag_dto_1 = require("./dto/feature-flag.dto");
const default_category_dto_1 = require("./dto/default-category.dto");
const admin_report_dto_1 = require("./dto/admin-report.dto");
const admin_notification_dto_1 = require("./dto/admin-notification.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return this.adminService.getAdminDashboardStats();
    }
    async getAllUsersOverview(page, limit) {
        return this.adminService.getAllUsersOverview(page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
    }
    async getUserActivitySummary(id) {
        return this.adminService.getUserActivitySummary(id);
    }
    async getRecentChatMessages(limit) {
        const parsed = limit ? parseInt(limit, 10) : 5;
        return this.adminService.getRecentChatMessages(Number.isFinite(parsed) ? parsed : 5);
    }
    async getAllTickets(page, limit, status) {
        return this.adminService.getAllTickets(page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, status);
    }
    async getTicketById(id) {
        return this.adminService.getTicketById(id);
    }
    async updateTicket(id, dto, user) {
        return this.adminService.updateTicket(id, user.sub, dto);
    }
    async replyToTicket(ticketId, dto, user) {
        return this.adminService.replyToTicket(ticketId, user.sub, dto, true);
    }
    async getAdminLogs(page, limit, adminId) {
        return this.adminService.getAdminLogs(page ? parseInt(page) : 1, limit ? parseInt(limit) : 20, adminId);
    }
    async listReports(query) {
        return this.adminService.listAdminReports(query);
    }
    async createReport(dto, user) {
        return this.adminService.createAdminReport(user.sub, dto);
    }
    async getReportById(id) {
        return this.adminService.getAdminReportById(id);
    }
    async generateReport(id, user) {
        return this.adminService.generateAdminReport(id, user.sub);
    }
    async getAllFeatureFlags() {
        return this.adminService.getAllFeatureFlags();
    }
    async createFeatureFlag(dto, user) {
        return this.adminService.createFeatureFlag(dto, user.sub);
    }
    async updateFeatureFlag(id, dto, user) {
        return this.adminService.updateFeatureFlag(id, dto, user.sub);
    }
    async toggleFeatureFlag(id, user) {
        return this.adminService.toggleFeatureFlag(id, user.sub);
    }
    async deleteFeatureFlag(id, user) {
        return this.adminService.deleteFeatureFlag(id, user.sub);
    }
    async getAllDefaultCategories() {
        return this.adminService.getAllDefaultCategories();
    }
    async getDefaultCategoryById(id) {
        return this.adminService.getDefaultCategoryById(id);
    }
    async createDefaultCategory(dto, user) {
        return this.adminService.createDefaultCategory(dto, user.sub);
    }
    async updateDefaultCategory(id, dto, user) {
        return this.adminService.updateDefaultCategory(id, dto, user.sub);
    }
    async deleteDefaultCategory(id, user) {
        return this.adminService.deleteDefaultCategory(id, user.sub);
    }
    async listNotificationBroadcasts(query) {
        return this.adminService.listNotificationBroadcasts(query.page ?? 1, query.limit ?? 20);
    }
    async broadcastNotification(dto, user) {
        return this.adminService.broadcastNotification(user.sub, dto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users/overview'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsersOverview", null);
__decorate([
    (0, common_1.Get)('users/:id/summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserActivitySummary", null);
__decorate([
    (0, common_1.Get)('chat/recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRecentChatMessages", null);
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllTickets", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTicketById", null);
__decorate([
    (0, common_1.Put)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Post)('tickets/:id/reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_dto_1.CreateTicketReplyDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replyToTicket", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminLogs", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_report_dto_1.ListAdminReportsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listReports", null);
__decorate([
    (0, common_1.Post)('reports'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_report_dto_1.CreateAdminReportDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReportById", null);
__decorate([
    (0, common_1.Post)('reports/:id/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('feature-flags'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllFeatureFlags", null);
__decorate([
    (0, common_1.Post)('feature-flags'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feature_flag_dto_1.CreateFeatureFlagDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createFeatureFlag", null);
__decorate([
    (0, common_1.Put)('feature-flags/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, feature_flag_dto_1.UpdateFeatureFlagDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateFeatureFlag", null);
__decorate([
    (0, common_1.Patch)('feature-flags/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleFeatureFlag", null);
__decorate([
    (0, common_1.Delete)('feature-flags/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteFeatureFlag", null);
__decorate([
    (0, common_1.Get)('default-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDefaultCategories", null);
__decorate([
    (0, common_1.Get)('default-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDefaultCategoryById", null);
__decorate([
    (0, common_1.Post)('default-categories'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [default_category_dto_1.CreateDefaultCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDefaultCategory", null);
__decorate([
    (0, common_1.Put)('default-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, default_category_dto_1.UpdateDefaultCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDefaultCategory", null);
__decorate([
    (0, common_1.Delete)('default-categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDefaultCategory", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_notification_dto_1.ListAdminNotificationBroadcastsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listNotificationBroadcasts", null);
__decorate([
    (0, common_1.Post)('notifications'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_notification_dto_1.CreateAdminNotificationBroadcastDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "broadcastNotification", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map