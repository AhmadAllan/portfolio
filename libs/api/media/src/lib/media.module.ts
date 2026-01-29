import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaFileController } from './file/file.controller';
import { MediaFileService } from './file/file.service';
import { ImageOptimizerService } from './file/image-optimizer.service';
import { MediaFolderController } from './folder/folder.controller';
import { MediaFolderService } from './folder/folder.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [MediaFileController, MediaFolderController],
  providers: [MediaFileService, ImageOptimizerService, MediaFolderService],
  exports: [MediaFileService, MediaFolderService, ImageOptimizerService],
})
export class MediaModule {}
