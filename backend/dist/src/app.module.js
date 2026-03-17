"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const fs_1 = require("fs");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const wallets_module_1 = require("./wallets/wallets.module");
const income_module_1 = require("./income/income.module");
const expenses_module_1 = require("./expenses/expenses.module");
const budgets_module_1 = require("./budgets/budgets.module");
const transactions_module_1 = require("./transactions/transactions.module");
const goals_module_1 = require("./goals/goals.module");
const analytics_module_1 = require("./analytics/analytics.module");
const notifications_module_1 = require("./notifications/notifications.module");
const settings_module_1 = require("./settings/settings.module");
const uploads_module_1 = require("./uploads/uploads.module");
const admin_module_1 = require("./admin/admin.module");
const support_module_1 = require("./support/support.module");
const categories_module_1 = require("./categories/categories.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            ...(() => {
                const uploadsRoot = (0, path_1.join)(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads');
                (0, fs_1.mkdirSync)(uploadsRoot, { recursive: true });
                return [
                    serve_static_1.ServeStaticModule.forRoot({
                        rootPath: uploadsRoot,
                        serveRoot: '/uploads',
                    }),
                ];
            })(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            wallets_module_1.WalletsModule,
            income_module_1.IncomeModule,
            expenses_module_1.ExpensesModule,
            budgets_module_1.BudgetsModule,
            transactions_module_1.TransactionsModule,
            goals_module_1.GoalsModule,
            analytics_module_1.AnalyticsModule,
            notifications_module_1.NotificationsModule,
            settings_module_1.SettingsModule,
            uploads_module_1.UploadsModule,
            admin_module_1.AdminModule,
            support_module_1.SupportModule,
            categories_module_1.CategoriesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map