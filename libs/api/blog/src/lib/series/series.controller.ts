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
import { SeriesService } from './series.service';
import { CreateSeriesDto, UpdateSeriesDto } from './dto';
import { JwtAuthGuard } from '@portfolio/api/core';
import { Public } from '@portfolio/api/core';

@Controller('blog/series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  /**
   * Public endpoint: List all series
   */
  @Public()
  @Get()
  async findAll() {
    return this.seriesService.findAll();
  }

  /**
   * Admin endpoint: Get series count
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/count')
  async count() {
    return this.seriesService.count();
  }

  /**
   * Public endpoint: Get a series by slug with posts
   */
  @Public()
  @Get('slug/:slug/posts')
  async findBySlugWithPosts(@Param('slug') slug: string) {
    return this.seriesService.findBySlugWithPosts(slug);
  }

  /**
   * Public endpoint: Get a series by slug
   */
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.seriesService.findBySlug(slug);
  }

  /**
   * Public endpoint: Get a series by ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  /**
   * Admin endpoint: Create a new series
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  /**
   * Admin endpoint: Update a series
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  /**
   * Admin endpoint: Delete a series
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }
}
