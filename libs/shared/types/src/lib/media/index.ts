import { MediaFileType } from '../common';

export interface IMediaFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  parent?: IMediaFolder;
  children?: IMediaFolder[];
  files?: IMediaFile[];
}

export interface IMediaFile {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  // Relations
  folder?: IMediaFolder;
}
