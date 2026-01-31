import type { MediaFileType } from '../common';

// ============================================
// Media Folder DTOs
// ============================================

export interface CreateMediaFolderDto {
  name: string;
  parentId?: string;
}

export interface UpdateMediaFolderDto {
  name?: string;
  parentId?: string;
}

// ============================================
// Media File DTOs
// ============================================

export interface CreateMediaFileDto {
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileType: MediaFileType;
  size: number;
  path: string;
  thumbnailPath?: string;
  width?: number;
  height?: number;
  altText?: string;
  altTextEn?: string;
  caption?: string;
  captionEn?: string;
  folderId?: string;
}

export interface UpdateMediaFileDto {
  filename?: string;
  originalFilename?: string;
  altText?: string;
  altTextEn?: string;
  caption?: string;
  captionEn?: string;
  folderId?: string;
}

// Upload-specific DTO
export interface UploadFileDto {
  file: Buffer | Express.Multer.File;
  folderId?: string;
  altText?: string;
  altTextEn?: string;
  caption?: string;
  captionEn?: string;
}
