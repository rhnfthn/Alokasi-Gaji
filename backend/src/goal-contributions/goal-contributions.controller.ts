import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/types/request-user.type';
import { GoalContributionsService } from './goal-contributions.service';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';

@Controller('goal-contributions')
@UseGuards(JwtAuthGuard)
export class GoalContributionsController {
  constructor(
    private readonly goalContributionsService: GoalContributionsService,
  ) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.goalContributionsService.list(user.sub);
  }

  @Get('goal/:goalId')
  listByGoal(
    @CurrentUser() user: RequestUser,
    @Param('goalId') goalId: string,
  ) {
    return this.goalContributionsService.listByGoal(user.sub, goalId);
  }

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateGoalContributionDto,
  ) {
    return this.goalContributionsService.create(user.sub, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.goalContributionsService.remove(user.sub, id);
  }
}
