import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type StorageBucket = 'receipts' | 'avatars';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient | null = null;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  isConfigured(): boolean {
    return this.supabase !== null;
  }

  async uploadFile(
    bucket: StorageBucket,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
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

      // Get public URL
      const { data } = this.supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: data.publicUrl,
      };
    } catch (error: any) {
      console.error('Upload file error:', error);
      return {
        success: false,
        error: error?.message || 'Upload failed',
      };
    }
  }

  async deleteFile(url: string): Promise<{ success: boolean }> {
    if (!this.supabase || !url) {
      return { success: false };
    }

    try {
      // Extract file path from URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/uploads/receipts/file.jpg
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
    } catch (error) {
      console.error('Delete file error:', error);
      return { success: false };
    }
  }
}
