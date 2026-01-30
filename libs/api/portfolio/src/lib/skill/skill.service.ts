import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db, skills } from '@portfolio/core';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  async getSkills() {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async getSkillsByCategory(category: string) {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.category, category))
      .orderBy(skills.order);
  }

  async getSkillById(id: string) {
    const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('Skill not found');
    }

    return result[0];
  }

  async createSkill(dto: CreateSkillDto) {
    const [result] = await db.insert(skills).values({
      name: dto.name,
      nameEn: dto.nameEn,
      category: dto.category,
      icon: dto.icon,
      order: dto.displayOrder,
    }).returning();

    return result;
  }

  async updateSkill(id: string, dto: UpdateSkillDto) {
    const existing = await db.select().from(skills).where(eq(skills.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Skill not found');
    }

    const updateData: Partial<typeof skills.$inferInsert> = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }
    if (dto.nameEn !== undefined) {
      updateData.nameEn = dto.nameEn;
    }
    if (dto.category !== undefined) {
      updateData.category = dto.category;
    }
    if (dto.icon !== undefined) {
      updateData.icon = dto.icon;
    }
    if (dto.displayOrder !== undefined) {
      updateData.order = dto.displayOrder;
    }

    const [result] = await db
      .update(skills)
      .set(updateData)
      .where(eq(skills.id, id))
      .returning();

    return result;
  }

  async deleteSkill(id: string) {
    const existing = await db.select().from(skills).where(eq(skills.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Skill not found');
    }

    await db.delete(skills).where(eq(skills.id, id));

    return { message: 'Skill deleted successfully' };
  }
}
