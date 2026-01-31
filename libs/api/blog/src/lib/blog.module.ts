import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { TagService } from './tag/tag.service';
import { TagController } from './tag/tag.controller';
import { SeriesService } from './series/series.service';
import { SeriesController } from './series/series.controller';

@Module({
  controllers: [
    PostController,
    CategoryController,
    TagController,
    SeriesController,
  ],
  providers: [
    PostService,
    CategoryService,
    TagService,
    SeriesService,
  ],
  exports: [
    PostService,
    CategoryService,
    TagService,
    SeriesService,
  ],
})
export class BlogModule {}
