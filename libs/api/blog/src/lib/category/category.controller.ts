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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtAuthGuard } from '@portfolio/api/core';
import { Public } from '@portfolio/api/core';

@Controller('blog/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Public endpoint: List all categories
   */
  @Public()
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Public endpoint: Get root categories (no parent)
   */
  @Public()
  @Get('root')
  async findRootCategories() {
    return this.categoryService.findRootCategories();
  }

  /**
   * Admin endpoint: Get category count
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/count')
  async count() {
    return this.categoryService.count();
  }

  /**
   * Public endpoint: Get a category by slug
   */
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  /**
   * Public endpoint: Get child categories of a parent
   */
  @Public()
  @Get(':parentId/children')
  async findChildCategories(@Param('parentId') parentId: string) {
    return this.categoryService.findChildCategories(parentId);
  }

  /**
   * Public endpoint: Get a category by ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  /**
   * Admin endpoint: Create a new category
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Admin endpoint: Update a category
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * Admin endpoint: Delete a category
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
