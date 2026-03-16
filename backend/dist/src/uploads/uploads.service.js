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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
let UploadsService = class UploadsService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getUploadsRoot() {
        return (0, path_1.join)(process.cwd(), this.configService.get('UPLOADS_DIR') ?? 'uploads');
    }
    ensureDir(category) {
        const dir = (0, path_1.join)(this.getUploadsRoot(), category);
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        return dir;
    }
    makeFilename(originalName) {
        const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        return `${(0, crypto_1.randomUUID)()}-${safe}`;
    }
    publicUrl(category, filename) {
        return `/uploads/${category}/${filename}`;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map