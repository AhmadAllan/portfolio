import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { db, mediaFolders, mediaFiles } from '@portfolio/core';
import { CreateFolderDto, UpdateFolderDto } from './dto';

// Maximum folder nesting depth
const MAX_FOLDER_DEPTH = 3;

@Injectable()
export class MediaFolderService {
  /**
   * Create a new folder
   */
  async createFolder(dto: CreateFolderDto) {
    // Check for duplicate name at same level
    await this.checkDuplicateName(dto.name, dto.parentId);

    // Validate parent and check depth
    if (dto.parentId) {
      await this.validateParentFolder(dto.parentId);
    }

    const [folder] = await db
      .insert(mediaFolders)
      .values({
        id: ulid(),
        name: dto.name,
        parentId: dto.parentId,
      })
      .returning();

    return this.enrichFolderWithCount(folder);
  }

  /**
   * Get all folders, optionally filtered by parent
   */
  async getFolders(parentId?: string | null) {
    const condition = parentId === null
      ? isNull(mediaFolders.parentId)
      : parentId
        ? eq(mediaFolders.parentId, parentId)
        : undefined;

    const folders = await db
      .select()
      .from(mediaFolders)
      .where(condition)
      .orderBy(mediaFolders.name);

    // Add file counts
    return Promise.all(folders.map((f) => this.enrichFolderWithCount(f)));
  }

  /**
   * Get folder tree (hierarchical structure)
   */
  async getFolderTree() {
    const allFolders = await db.select().from(mediaFolders).orderBy(mediaFolders.name);

    // Build tree structure
    const folderMap = new Map<string, any>();
    const rootFolders: any[] = [];

    // First pass: create folder objects with file counts
    for (const folder of allFolders) {
      const enriched = await this.enrichFolderWithCount(folder);
      folderMap.set(folder.id, { ...enriched, children: [] });
    }

    // Second pass: build hierarchy
    for (const folder of allFolders) {
      const folderNode = folderMap.get(folder.id);
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderNode);
        }
      } else {
        rootFolders.push(folderNode);
      }
    }

    return rootFolders;
  }

  /**
   * Get a single folder by ID
   */
  async getFolder(id: string) {
    const [folder] = await db
      .select()
      .from(mediaFolders)
      .where(eq(mediaFolders.id, id))
      .limit(1);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return this.enrichFolderWithCount(folder);
  }

  /**
   * Update a folder
   */
  async updateFolder(id: string, dto: UpdateFolderDto) {
    const folder = await this.getFolder(id);

    // Check for circular reference
    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Folder cannot be its own parent');
      }
      await this.checkCircularReference(id, dto.parentId);
      await this.validateParentFolder(dto.parentId);
    }

    // Check for duplicate name if name is changing
    if (dto.name && dto.name !== folder.name) {
      await this.checkDuplicateName(dto.name, dto.parentId ?? folder.parentId);
    }

    const [updated] = await db
      .update(mediaFolders)
      .set({
        name: dto.name ?? folder.name,
        parentId: dto.parentId !== undefined ? dto.parentId : folder.parentId,
        updatedAt: new Date(),
      })
      .where(eq(mediaFolders.id, id))
      .returning();

    return this.enrichFolderWithCount(updated);
  }

  /**
   * Delete a folder (must be empty)
   */
  async deleteFolder(id: string) {
    const folder = await this.getFolder(id);

    // Check for child folders
    const [childFolder] = await db
      .select()
      .from(mediaFolders)
      .where(eq(mediaFolders.parentId, id))
      .limit(1);

    if (childFolder) {
      throw new ConflictException('Cannot delete folder with subfolders');
    }

    // Check for files
    const [file] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.folderId, id))
      .limit(1);

    if (file) {
      throw new ConflictException('Cannot delete folder with files');
    }

    await db.delete(mediaFolders).where(eq(mediaFolders.id, id));

    return { message: 'Folder deleted successfully' };
  }

  /**
   * Check for duplicate folder name at the same level
   */
  private async checkDuplicateName(name: string, parentId?: string) {
    const condition = parentId
      ? and(eq(mediaFolders.name, name), eq(mediaFolders.parentId, parentId))
      : and(eq(mediaFolders.name, name), isNull(mediaFolders.parentId));

    const [existing] = await db
      .select()
      .from(mediaFolders)
      .where(condition)
      .limit(1);

    if (existing) {
      throw new ConflictException('A folder with this name already exists at this level');
    }
  }

  /**
   * Validate parent folder exists and check depth
   */
  private async validateParentFolder(parentId: string) {
    const depth = await this.getFolderDepth(parentId);
    if (depth >= MAX_FOLDER_DEPTH - 1) {
      throw new BadRequestException(`Maximum folder depth of ${MAX_FOLDER_DEPTH} exceeded`);
    }
  }

  /**
   * Get the depth of a folder in the hierarchy
   */
  private async getFolderDepth(folderId: string): Promise<number> {
    let depth = 0;
    let currentId: string | null = folderId;

    while (currentId) {
      const [folder] = await db
        .select()
        .from(mediaFolders)
        .where(eq(mediaFolders.id, currentId))
        .limit(1);

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      depth++;
      currentId = folder.parentId;
    }

    return depth;
  }

  /**
   * Check for circular reference when moving folders
   */
  private async checkCircularReference(folderId: string, newParentId: string) {
    let currentId: string | null = newParentId;

    while (currentId) {
      if (currentId === folderId) {
        throw new BadRequestException('Cannot create circular folder reference');
      }

      const [folder] = await db
        .select()
        .from(mediaFolders)
        .where(eq(mediaFolders.id, currentId))
        .limit(1);

      currentId = folder?.parentId ?? null;
    }
  }

  /**
   * Add file count to folder object
   */
  private async enrichFolderWithCount(folder: typeof mediaFolders.$inferSelect) {
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mediaFiles)
      .where(eq(mediaFiles.folderId, folder.id));

    return {
      ...folder,
      fileCount: countResult?.count || 0,
    };
  }
}
