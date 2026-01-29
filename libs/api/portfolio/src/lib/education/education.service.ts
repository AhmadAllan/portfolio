import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db, educations } from '@portfolio/core';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  async getEducations() {
    return await db.select().from(educations).orderBy(educations.order);
  }

  async getEducationById(id: string) {
    const result = await db.select().from(educations).where(eq(educations.id, id)).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('Education not found');
    }

    return result[0];
  }

  async createEducation(dto: CreateEducationDto) {
    const [result] = await db.insert(educations).values({
      institution: dto.institution,
      institutionEn: dto.institutionEn,
      degree: dto.degree,
      degreeEn: dto.degreeEn,
      field: dto.field,
      fieldEn: dto.fieldEn,
      description: dto.description,
      descriptionEn: dto.descriptionEn,
      year: dto.year,
      isCertification: dto.type === 'certification',
      order: dto.displayOrder,
    }).returning();

    return result;
  }

  async updateEducation(id: string, dto: UpdateEducationDto) {
    const existing = await db.select().from(educations).where(eq(educations.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Education not found');
    }

    const updateData: any = {};

    if (dto.institution !== undefined) updateData.institution = dto.institution;
    if (dto.institutionEn !== undefined) updateData.institutionEn = dto.institutionEn;
    if (dto.degree !== undefined) updateData.degree = dto.degree;
    if (dto.degreeEn !== undefined) updateData.degreeEn = dto.degreeEn;
    if (dto.field !== undefined) updateData.field = dto.field;
    if (dto.fieldEn !== undefined) updateData.fieldEn = dto.fieldEn;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.descriptionEn !== undefined) updateData.descriptionEn = dto.descriptionEn;
    if (dto.year !== undefined) updateData.year = dto.year;
    if (dto.type !== undefined) updateData.isCertification = dto.type === 'certification';
    if (dto.displayOrder !== undefined) updateData.order = dto.displayOrder;

    const [result] = await db
      .update(educations)
      .set(updateData)
      .where(eq(educations.id, id))
      .returning();

    return result;
  }

  async deleteEducation(id: string) {
    const existing = await db.select().from(educations).where(eq(educations.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Education not found');
    }

    await db.delete(educations).where(eq(educations.id, id));

    return { message: 'Education deleted successfully' };
  }
}
