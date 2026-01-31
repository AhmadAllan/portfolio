import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { db, experiences } from '@portfolio/core';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  async getExperiences() {
    return await db.select().from(experiences).orderBy(experiences.order);
  }

  async getCurrentExperiences() {
    return await db
      .select()
      .from(experiences)
      .where(eq(experiences.isCurrent, true))
      .orderBy(experiences.order);
  }

  async getExperienceById(id: string) {
    const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('Experience not found');
    }

    return result[0];
  }

  async createExperience(dto: CreateExperienceDto) {
    const [result] = await db.insert(experiences).values({
      company: dto.company,
      companyEn: dto.companyEn,
      title: dto.title,
      titleEn: dto.titleEn,
      location: dto.location,
      locationEn: dto.locationEn,
      type: dto.employmentType,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      isCurrent: dto.current,
      description: dto.description,
      descriptionEn: dto.descriptionEn,
      order: dto.displayOrder,
    }).returning();

    return result;
  }

  async updateExperience(id: string, dto: UpdateExperienceDto) {
    const existing = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Experience not found');
    }

    const updateData: Partial<typeof experiences.$inferInsert> = {};

    if (dto.company !== undefined) {
      updateData.company = dto.company;
    }
    if (dto.companyEn !== undefined) {
      updateData.companyEn = dto.companyEn;
    }
    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.titleEn !== undefined) {
      updateData.titleEn = dto.titleEn;
    }
    if (dto.location !== undefined) {
      updateData.location = dto.location;
    }
    if (dto.locationEn !== undefined) {
      updateData.locationEn = dto.locationEn;
    }
    if (dto.employmentType !== undefined) {
      updateData.type = dto.employmentType;
    }
    if (dto.startDate !== undefined) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }
    if (dto.current !== undefined) {
      updateData.isCurrent = dto.current;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.descriptionEn !== undefined) {
      updateData.descriptionEn = dto.descriptionEn;
    }
    if (dto.displayOrder !== undefined) {
      updateData.order = dto.displayOrder;
    }

    const [result] = await db
      .update(experiences)
      .set(updateData)
      .where(eq(experiences.id, id))
      .returning();

    return result;
  }

  async deleteExperience(id: string) {
    const existing = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Experience not found');
    }

    await db.delete(experiences).where(eq(experiences.id, id));

    return { message: 'Experience deleted successfully' };
  }
}
