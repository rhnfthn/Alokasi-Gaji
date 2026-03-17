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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let StorageService = class StorageService {
    configService;
    supabase = null;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (supabaseUrl && supabaseKey) {
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        }
    }
    isConfigured() {
        return this.supabase !== null;
    }
    async uploadFile(bucket, file) {
        if (!this.supabase) {
            return {
                success: false,
                error: 'Supabase storage not configured',
            };
        }
        try {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${bucket}/${fileName}`;
            const { error: uploadError } = await this.supabase.storage
                .from('uploads')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                return {
                    success: false,
                    error: uploadError.message,
                };
            }
            const { data } = this.supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);
            return {
                success: true,
                url: data.publicUrl,
            };
        }
        catch (error) {
            console.error('Upload file error:', error);
            return {
                success: false,
                error: error?.message || 'Upload failed',
            };
        }
    }
    async deleteFile(url) {
        if (!this.supabase || !url) {
            return { success: false };
        }
        try {
            const parts = url.split('/uploads/');
            if (parts.length !== 2) {
                return { success: false };
            }
            const filePath = parts[1];
            const { error } = await this.supabase.storage
                .from('uploads')
                .remove([filePath]);
            if (error) {
                console.error('Supabase delete error:', error);
                return { success: false };
            }
            return { success: true };
        }
        catch (error) {
            console.error('Delete file error:', error);
            return { success: false };
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map