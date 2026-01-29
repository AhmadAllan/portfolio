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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@portfolio/core';
import { MediaFileService, UploadedFile as UploadedFileType } from './file.service';
import { UploadFileDto, UpdateMediaMetadataDto, MAX_FILE_SIZE } from './dto';

@ApiTags('media')
@Controller('admin/media')
@UseGuards(JwtAuthGuard)
export class MediaFileController {
  constructor(private fileService: MediaFileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folderId: {
          type: 'string',
          description: 'Optional folder ID',
        },
        altText: {
          type: 'string',
          description: 'Arabic alt text',
        },
        altTextEn: {
          type: 'string',
          description: 'English alt text',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 413, description: 'File too large' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|gif|webp|svg\+xml)/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Body() dto: UploadFileDto
  ) {
    const uploadedFile: UploadedFileType = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    return this.fileService.uploadFile(uploadedFile, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List media files' })
  @ApiQuery({ name: 'folderId', required: false, description: 'Filter by folder ID' })
  @ApiQuery({ name: 'root', required: false, type: Boolean, description: 'Get only root level files' })
  @ApiResponse({ status: 200, description: 'List of media files' })
  async getFiles(
    @Query('folderId') folderId?: string,
    @Query('root') root?: string
  ) {
    const folderFilter = root === 'true' ? null : folderId;
    const files = await this.fileService.getFiles(folderFilter);
    return { files };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'File details' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFile(@Param('id') id: string) {
    const file = await this.fileService.getFile(id);
    return { file };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file metadata' })
  @ApiResponse({ status: 200, description: 'File updated' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async updateMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateMediaMetadataDto
  ) {
    const file = await this.fileService.updateMetadata(id, dto);
    return { file };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }
}
