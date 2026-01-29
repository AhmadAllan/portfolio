import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '@portfolio/core';

@Controller('portfolio/experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  getExperiences() {
    return this.experienceService.getExperiences();
  }

  @Get('current')
  getCurrentExperiences() {
    return this.experienceService.getCurrentExperiences();
  }

  @Get(':id')
  getExperienceById(@Param('id') id: string) {
    return this.experienceService.getExperienceById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createExperience(@Body() dto: CreateExperienceDto) {
    return this.experienceService.createExperience(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateExperience(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.experienceService.updateExperience(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteExperience(@Param('id') id: string) {
    return this.experienceService.deleteExperience(id);
  }
}
