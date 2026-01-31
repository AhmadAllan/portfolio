import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { ulid } from 'ulid';
import * as path from 'path';
import * as fs from 'fs/promises';
import { db, mediaFiles, mediaFolders } from '@portfolio/core';
import { ImageOptimizerService } from './image-optimizer.service';
import { UploadFileDto, UpdateMediaMetadataDto, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from './dto';

export interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class MediaFileService {
  private readonly logger = new Logger(MediaFileService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    private imageOptimizer: ImageOptimizerService
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.baseUrl = '/uploads';
  }

  /**
   * Upload a file with optional optimization
   */
  async uploadFile(file: UploadedFile, dto: UploadFileDto) {
    // Validate file
    this.validateFile(file);

    // Validate folder if provided
    if (dto.folderId) {
      await this.validateFolderExists(dto.folderId);
    }

    const fileId = ulid();
    const fileType = this.imageOptimizer.getFileType(file.mimetype);
    const ext = this.imageOptimizer.isImage(file.mimetype) ? '.webp' : path.extname(file.originalname);
    const filename = `${fileId}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    let width: number | undefined;
    let height: number | undefined;
    let thumbnailPath: string | undefined;
    let savedBuffer = file.buffer;

    // Optimize images
    if (this.imageOptimizer.isImage(file.mimetype)) {
      try {
        const optimized = await this.imageOptimizer.optimizeImage(file.buffer);
        savedBuffer = optimized.buffer;
        width = optimized.width;
        height = optimized.height;

        // Generate thumbnail
        const thumbnail = await this.imageOptimizer.generateThumbnail(file.buffer);
        const thumbFilename = `${fileId}_thumb.webp`;
        const thumbPath = path.join(this.uploadDir, 'thumbnails', thumbFilename);
        await this.imageOptimizer.saveToFile(thumbnail.buffer, thumbPath);
        thumbnailPath = `${this.baseUrl}/thumbnails/${thumbFilename}`;
      } catch (error) {
        this.logger.error('Image optimization failed, saving original', error);
        const metadata = await this.imageOptimizer.getImageMetadata(file.buffer);
        width = metadata.width;
        height = metadata.height;
      }
    }

    // Save file
    await this.imageOptimizer.saveToFile(savedBuffer, filePath);

    // Save to database
    const [newFile] = await db
      .insert(mediaFiles)
      .values({
        id: fileId,
        filename,
        originalFilename: file.originalname,
        mimeType: this.imageOptimizer.isImage(file.mimetype) ? 'image/webp' : file.mimetype,
        fileType,
        size: savedBuffer.length,
        path: `${this.baseUrl}/${filename}`,
        thumbnailPath,
        width,
        height,
        altText: dto.altText,
        altTextEn: dto.altTextEn,
        folderId: dto.folderId,
      })
      .returning();

    return newFile;
  }

  /**
   * Get all files, optionally filtered by folder
   */
  async getFiles(folderId?: string | null) {
    const condition = folderId === null
      ? isNull(mediaFiles.folderId)
      : folderId
        ? eq(mediaFiles.folderId, folderId)
        : undefined;

    return db
      .select()
      .from(mediaFiles)
      .where(condition)
      .orderBy(desc(mediaFiles.createdAt));
  }

  /**
   * Get a single file by ID
   */
  async getFile(id: string) {
    const [file] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, id))
      .limit(1);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  /**
   * Update file metadata
   */
  async updateMetadata(id: string, dto: UpdateMediaMetadataDto) {
    const file = await this.getFile(id);

    // Validate folder if changing
    if (dto.folderId && dto.folderId !== file.folderId) {
      await this.validateFolderExists(dto.folderId);
    }

    const [updated] = await db
      .update(mediaFiles)
      .set({
        altText: dto.altText ?? file.altText,
        altTextEn: dto.altTextEn ?? file.altTextEn,
        caption: dto.caption ?? file.caption,
        captionEn: dto.captionEn ?? file.captionEn,
        folderId: dto.folderId ?? file.folderId,
        updatedAt: new Date(),
      })
      .where(eq(mediaFiles.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete a file
   */
  async deleteFile(id: string) {
    const file = await this.getFile(id);

    // Delete physical files
    const fullPath = path.join(process.cwd(), file.path.replace(this.baseUrl, this.uploadDir));
    await this.imageOptimizer.deleteFile(fullPath);

    if (file.thumbnailPath) {
      const thumbPath = path.join(
        process.cwd(),
        file.thumbnailPath.replace(this.baseUrl, this.uploadDir)
      );
      await this.imageOptimizer.deleteFile(thumbPath);
    }

    // Delete from database
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));

    return { message: 'File deleted successfully' };
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: UploadedFile) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }
  }

  /**
   * Validate that a folder exists
   */
  private async validateFolderExists(folderId: string) {
    const [folder] = await db
      .select()
      .from(mediaFolders)
      .where(eq(mediaFolders.id, folderId))
      .limit(1);

    if (!folder) {
      throw new BadRequestException('Folder not found');
    }
  }
}
