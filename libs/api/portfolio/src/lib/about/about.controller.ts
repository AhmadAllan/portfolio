import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '@portfolio/core';

@Controller('portfolio/about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout() {
    return this.aboutService.getAbout();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createAbout(@Body() dto: CreateAboutDto) {
    return this.aboutService.createAbout(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateAbout(@Param('id') id: string, @Body() dto: UpdateAboutDto) {
    return this.aboutService.updateAbout(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteAbout(@Param('id') id: string) {
    return this.aboutService.deleteAbout(id);
  }
}
