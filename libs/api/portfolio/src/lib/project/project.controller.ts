import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '@portfolio/core';

@Controller('portfolio/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects() {
    return this.projectService.getProjects();
  }

  @Get('featured')
  getFeaturedProjects() {
    return this.projectService.getFeaturedProjects();
  }

  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Get('slug/:slug')
  getProjectBySlug(@Param('slug') slug: string) {
    return this.projectService.getProjectBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.updateProject(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
