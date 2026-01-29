import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface OptimizedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
}

export interface ThumbnailResult {
  buffer: Buffer;
  width: number;
  height: number;
}

@Injectable()
export class ImageOptimizerService {
  private readonly logger = new Logger(ImageOptimizerService.name);

  // Thumbnail settings
  private readonly thumbnailWidth = 300;
  private readonly thumbnailHeight = 300;

  // WebP quality settings
  private readonly webpQuality = 80;

  /**
   * Optimize an image by converting to WebP and resizing if needed
   */
  async optimizeImage(
    inputBuffer: Buffer,
    maxWidth = 1920,
    maxHeight = 1080
  ): Promise<OptimizedImage> {
    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();

      let pipeline = image;

      // Resize if image exceeds max dimensions
      if (
        (metadata.width && metadata.width > maxWidth) ||
        (metadata.height && metadata.height > maxHeight)
      ) {
        pipeline = pipeline.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert to WebP for better compression
      const optimizedBuffer = await pipeline
        .webp({ quality: this.webpQuality })
        .toBuffer();

      const optimizedMetadata = await sharp(optimizedBuffer).metadata();

      return {
        buffer: optimizedBuffer,
        width: optimizedMetadata.width || 0,
        height: optimizedMetadata.height || 0,
        format: 'webp',
      };
    } catch (error) {
      this.logger.error('Failed to optimize image', error);
      throw error;
    }
  }

  /**
   * Generate a thumbnail for an image
   */
  async generateThumbnail(inputBuffer: Buffer): Promise<ThumbnailResult> {
    try {
      const thumbnailBuffer = await sharp(inputBuffer)
        .resize(this.thumbnailWidth, this.thumbnailHeight, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 75 })
        .toBuffer();

      return {
        buffer: thumbnailBuffer,
        width: this.thumbnailWidth,
        height: this.thumbnailHeight,
      };
    } catch (error) {
      this.logger.error('Failed to generate thumbnail', error);
      throw error;
    }
  }

  /**
   * Get image metadata without full processing
   */
  async getImageMetadata(
    inputBuffer: Buffer
  ): Promise<{ width: number; height: number; format: string }> {
    const metadata = await sharp(inputBuffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
    };
  }

  /**
   * Check if a file is an image based on MIME type
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Determine file type category from MIME type
   */
  getFileType(mimeType: string): 'image' | 'video' | 'document' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (
      mimeType.startsWith('application/pdf') ||
      mimeType.startsWith('application/msword') ||
      mimeType.startsWith('application/vnd.')
    ) {
      return 'document';
    }
    return 'other';
  }

  /**
   * Save buffer to file
   */
  async saveToFile(buffer: Buffer, filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, buffer);
  }

  /**
   * Delete a file if it exists
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
