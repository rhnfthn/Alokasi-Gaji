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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
const storage_service_1 = require("../storage/storage.service");
const multer_1 = require("multer");
const uploads_service_1 = require("./uploads.service");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let UploadsController = class UploadsController {
    storageService;
    usersService;
    uploadsService;
    constructor(storageService, usersService, uploadsService) {
        this.storageService = storageService;
        this.usersService = usersService;
        this.uploadsService = uploadsService;
    }
    async uploadLocal(category, file) {
        const dir = this.uploadsService.ensureDir(category);
        const filename = this.uploadsService.makeFilename(file.originalname);
        const fullPath = (0, path_1.join)(dir, filename);
        await (0, promises_1.writeFile)(fullPath, file.buffer);
        return this.uploadsService.publicUrl(category, filename);
    }
    async uploadReceipt(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        let url;
        if (this.storageService.isConfigured()) {
            const result = await this.storageService.uploadFile('receipts', file);
            if (!result.success) {
                throw new common_1.BadRequestException(result.error || 'Upload failed');
            }
            url = result.url;
        }
        else {
            url = await this.uploadLocal('receipts', file);
        }
        return {
            success: true,
            url,
        };
    }
    async uploadAvatar(user, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        let url;
        if (this.storageService.isConfigured()) {
            const result = await this.storageService.uploadFile('avatars', file);
            if (!result.success) {
                throw new common_1.BadRequestException(result.error || 'Upload failed');
            }
            url = result.url;
        }
        else {
            url = await this.uploadLocal('avatars', file);
        }
        const updatedUser = await this.usersService.setAvatar(user.sub, url);
        return {
            success: true,
            url,
            user: updatedUser,
        };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('receipt'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadReceipt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadAvatar", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        users_service_1.UsersService,
        uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map