import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, ListPostsDto } from './dto';
import { JwtAuthGuard } from '@portfolio/api/core';
import { Public } from '@portfolio/api/core';

@Controller('blog/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Public endpoint: List all published posts with optional filtering
   */
  @Public()
  @Get()
  async findAll(@Query() query: ListPostsDto) {
    // For public access, default to published status
    if (!query.status) {
      query.status = 'published' as any;
    }
    return this.postService.findAll(query);
  }

  /**
   * Admin endpoint: Get post count
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/count')
  async count(@Query() query: ListPostsDto) {
    return this.postService.count(query);
  }

  /**
   * Public endpoint: Get a published post by slug
   */
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  /**
   * Public endpoint: Get a published post by ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  /**
   * Admin endpoint: Create a new post
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  /**
   * Admin endpoint: Update a post
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  /**
   * Admin endpoint: Delete a post
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
