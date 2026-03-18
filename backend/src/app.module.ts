import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { IncomeModule } from './income/income.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetsModule } from './budgets/budgets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GoalsModule } from './goals/goals.module';
import { GoalContributionsModule } from './goal-contributions/goal-contributions.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SettingsModule } from './settings/settings.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(() => {
      const uploadsRoot = join(
        process.cwd(),
        process.env.UPLOADS_DIR ?? 'uploads',
      );

      try {
        // On some serverless providers (e.g. Vercel), the filesystem under process.cwd()
        // can be read-only (e.g. /var/task). Don't crash the server if local uploads
        // aren't possible; simply skip static serving.
        mkdirSync(uploadsRoot, { recursive: true });

        return [
          ServeStaticModule.forRoot({
            rootPath: uploadsRoot,
            serveRoot: '/uploads',
          }),
        ];
      } catch {
        return [];
      }
    })(),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletsModule,
    IncomeModule,
    ExpensesModule,
    BudgetsModule,
    TransactionsModule,
    GoalsModule,
    GoalContributionsModule,
    AnalyticsModule,
    NotificationsModule,
    SettingsModule,
    UploadsModule,
    AdminModule,
    SupportModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
