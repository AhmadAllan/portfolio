import { Module } from '@nestjs/common';
import { CoreModule } from '@portfolio/core';
import { MediaModule } from '@portfolio/media';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
