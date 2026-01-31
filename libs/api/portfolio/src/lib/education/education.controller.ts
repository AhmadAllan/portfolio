import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '@portfolio/core';

@Controller('portfolio/educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  getEducations() {
    return this.educationService.getEducations();
  }

  @Get(':id')
  getEducationById(@Param('id') id: string) {
    return this.educationService.getEducationById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createEducation(@Body() dto: CreateEducationDto) {
    return this.educationService.createEducation(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateEducation(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.educationService.updateEducation(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteEducation(@Param('id') id: string) {
    return this.educationService.deleteEducation(id);
  }
}
