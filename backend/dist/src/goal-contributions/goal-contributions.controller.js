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
exports.GoalContributionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const goal_contributions_service_1 = require("./goal-contributions.service");
const create_goal_contribution_dto_1 = require("./dto/create-goal-contribution.dto");
let GoalContributionsController = class GoalContributionsController {
    goalContributionsService;
    constructor(goalContributionsService) {
        this.goalContributionsService = goalContributionsService;
    }
    list(user) {
        return this.goalContributionsService.list(user.sub);
    }
    listByGoal(user, goalId) {
        return this.goalContributionsService.listByGoal(user.sub, goalId);
    }
    create(user, dto) {
        return this.goalContributionsService.create(user.sub, dto);
    }
    remove(user, id) {
        return this.goalContributionsService.remove(user.sub, id);
    }
};
exports.GoalContributionsController = GoalContributionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalContributionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('goal/:goalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('goalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GoalContributionsController.prototype, "listByGoal", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_goal_contribution_dto_1.CreateGoalContributionDto]),
    __metadata("design:returntype", void 0)
], GoalContributionsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GoalContributionsController.prototype, "remove", null);
exports.GoalContributionsController = GoalContributionsController = __decorate([
    (0, common_1.Controller)('goal-contributions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [goal_contributions_service_1.GoalContributionsService])
], GoalContributionsController);
//# sourceMappingURL=goal-contributions.controller.js.map