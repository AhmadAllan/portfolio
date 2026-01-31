import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { JwtAuthGuard } from '@portfolio/api/core';
import { Public } from '@portfolio/api/core';

@Controller('blog/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Public endpoint: List all tags
   */
  @Public()
  @Get()
  async findAll() {
    return this.tagService.findAll();
  }

  /**
   * Admin endpoint: Get tag count
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/count')
  async count() {
    return this.tagService.count();
  }

  /**
   * Public endpoint: Get a tag by slug
   */
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.tagService.findBySlug(slug);
  }

  /**
   * Public endpoint: Get a tag by ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  /**
   * Admin endpoint: Create a new tag
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  /**
   * Admin endpoint: Update a tag
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  /**
   * Admin endpoint: Delete a tag
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
