import { Module } from '@nestjs/common';
import { GoalContributionsController } from './goal-contributions.controller';
import { GoalContributionsService } from './goal-contributions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GoalContributionsController],
  providers: [GoalContributionsService],
  exports: [GoalContributionsService],
})
export class GoalContributionsModule {}
