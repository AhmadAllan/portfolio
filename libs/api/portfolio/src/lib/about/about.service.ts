import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db, about } from '@portfolio/core';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  async getAbout() {
    const result = await db.select().from(about).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('About information not found');
    }

    return result[0];
  }

  async createAbout(dto: CreateAboutDto) {
    const [result] = await db.insert(about).values({
      name: dto.name,
      nameEn: dto.nameEn,
      title: dto.title,
      titleEn: dto.titleEn,
      bio: dto.bio,
      bioEn: dto.bioEn,
      avatar: dto.avatar,
      email: dto.email,
      socialLinks: JSON.stringify(dto.socialLinks),
    }).returning();

    return result;
  }

  async updateAbout(id: string, dto: UpdateAboutDto) {
    const existing = await db.select().from(about).where(eq(about.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('About information not found');
    }

    const updateData: Partial<typeof about.$inferInsert> = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }
    if (dto.nameEn !== undefined) {
      updateData.nameEn = dto.nameEn;
    }
    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.titleEn !== undefined) {
      updateData.titleEn = dto.titleEn;
    }
    if (dto.bio !== undefined) {
      updateData.bio = dto.bio;
    }
    if (dto.bioEn !== undefined) {
      updateData.bioEn = dto.bioEn;
    }
    if (dto.avatar !== undefined) {
      updateData.avatar = dto.avatar;
    }
    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }
    if (dto.socialLinks !== undefined) {
      updateData.socialLinks = JSON.stringify(dto.socialLinks);
    }

    const [result] = await db
      .update(about)
      .set(updateData)
      .where(eq(about.id, id))
      .returning();

    return result;
  }

  async deleteAbout(id: string) {
    const existing = await db.select().from(about).where(eq(about.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('About information not found');
    }

    await db.delete(about).where(eq(about.id, id));

    return { message: 'About information deleted successfully' };
  }
}
