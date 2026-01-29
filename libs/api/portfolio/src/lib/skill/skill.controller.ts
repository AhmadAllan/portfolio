import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '@portfolio/core';

@Controller('portfolio/skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  getSkills() {
    return this.skillService.getSkills();
  }

  @Get('category/:category')
  getSkillsByCategory(@Param('category') category: string) {
    return this.skillService.getSkillsByCategory(category);
  }

  @Get(':id')
  getSkillById(@Param('id') id: string) {
    return this.skillService.getSkillById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createSkill(@Body() dto: CreateSkillDto) {
    return this.skillService.createSkill(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateSkill(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillService.updateSkill(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteSkill(@Param('id') id: string) {
    return this.skillService.deleteSkill(id);
  }
}
