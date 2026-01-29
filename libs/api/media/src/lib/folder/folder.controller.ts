import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@portfolio/core';
import { MediaFolderService } from './folder.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';

@ApiTags('media')
@Controller('admin/media/folders')
@UseGuards(JwtAuthGuard)
export class MediaFolderController {
  constructor(private folderService: MediaFolderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a folder' })
  @ApiResponse({ status: 201, description: 'Folder created' })
  @ApiResponse({ status: 400, description: 'Invalid data or max depth exceeded' })
  @ApiResponse({ status: 409, description: 'Folder name already exists' })
  async createFolder(@Body() dto: CreateFolderDto) {
    const folder = await this.folderService.createFolder(dto);
    return { folder };
  }

  @Get()
  @ApiOperation({ summary: 'List folders' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filter by parent folder ID' })
  @ApiQuery({ name: 'root', required: false, type: Boolean, description: 'Get only root level folders' })
  @ApiResponse({ status: 200, description: 'List of folders' })
  async getFolders(
    @Query('parentId') parentId?: string,
    @Query('root') root?: string
  ) {
    const folderFilter = root === 'true' ? null : parentId;
    const folders = await this.folderService.getFolders(folderFilter);
    return { folders };
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get folder tree structure' })
  @ApiResponse({ status: 200, description: 'Hierarchical folder tree' })
  async getFolderTree() {
    const tree = await this.folderService.getFolderTree();
    return { folders: tree };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by ID' })
  @ApiResponse({ status: 200, description: 'Folder details' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async getFolder(@Param('id') id: string) {
    const folder = await this.folderService.getFolder(id);
    return { folder };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update folder' })
  @ApiResponse({ status: 200, description: 'Folder updated' })
  @ApiResponse({ status: 400, description: 'Invalid data or circular reference' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async updateFolder(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto
  ) {
    const folder = await this.folderService.updateFolder(id, dto);
    return { folder };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete folder' })
  @ApiResponse({ status: 200, description: 'Folder deleted' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  @ApiResponse({ status: 409, description: 'Folder not empty' })
  async deleteFolder(@Param('id') id: string) {
    return this.folderService.deleteFolder(id);
  }
}
