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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAdminReportsQueryDto = exports.CreateAdminReportDto = exports.ReportType = exports.ReportStatus = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "ReportStatus", { enumerable: true, get: function () { return client_1.ReportStatus; } });
Object.defineProperty(exports, "ReportType", { enumerable: true, get: function () { return client_1.ReportType; } });
const class_validator_1 = require("class-validator");
class CreateAdminReportDto {
    title;
    description;
    type;
    dateFrom;
    dateTo;
}
exports.CreateAdminReportDto = CreateAdminReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminReportDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdminReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ReportType),
    __metadata("design:type", String)
], CreateAdminReportDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdminReportDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdminReportDto.prototype, "dateTo", void 0);
class ListAdminReportsQueryDto {
    page;
    limit;
    status;
    type;
}
exports.ListAdminReportsQueryDto = ListAdminReportsQueryDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAdminReportsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListAdminReportsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ReportStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAdminReportsQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ReportType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListAdminReportsQueryDto.prototype, "type", void 0);
//# sourceMappingURL=admin-report.dto.js.map