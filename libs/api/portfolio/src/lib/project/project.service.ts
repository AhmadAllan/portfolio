import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { db, projects } from '@portfolio/core';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  async getProjects() {
    return await db.select().from(projects).orderBy(projects.order);
  }

  async getFeaturedProjects() {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'active'))
      .orderBy(projects.order);
  }

  async getProjectBySlug(slug: string) {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('Project not found');
    }

    return result[0];
  }

  async getProjectById(id: string) {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (!result || result.length === 0) {
      throw new NotFoundException('Project not found');
    }

    return result[0];
  }

  async createProject(dto: CreateProjectDto) {
    try {
      const [result] = await db.insert(projects).values({
        slug: dto.slug,
        title: dto.title,
        titleEn: dto.titleEn,
        description: dto.description,
        descriptionEn: dto.descriptionEn,
        thumbnail: dto.thumbnail,
        techStack: JSON.stringify(dto.techStack),
        role: dto.role,
        roleEn: dto.roleEn,
        gallery: dto.gallery ? JSON.stringify(dto.gallery) : null,
        liveUrl: dto.liveUrl,
        githubUrl: dto.githubUrl,
        status: 'active',
        order: dto.displayOrder,
      }).returning();

      return result;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Invalid data format for JSON fields');
      }
      throw error;
    }
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const updateData: Partial<typeof projects.$inferInsert> = {};

    if (dto.slug !== undefined) {
      updateData.slug = dto.slug;
    }
    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.titleEn !== undefined) {
      updateData.titleEn = dto.titleEn;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.descriptionEn !== undefined) {
      updateData.descriptionEn = dto.descriptionEn;
    }
    if (dto.thumbnail !== undefined) {
      updateData.thumbnail = dto.thumbnail;
    }
    if (dto.techStack !== undefined) {
      try {
        updateData.techStack = JSON.stringify(dto.techStack);
      } catch (error) {
        throw new Error('Invalid techStack format');
      }
    }
    if (dto.role !== undefined) {
      updateData.role = dto.role;
    }
    if (dto.roleEn !== undefined) {
      updateData.roleEn = dto.roleEn;
    }
    if (dto.gallery !== undefined) {
      try {
        updateData.gallery = dto.gallery ? JSON.stringify(dto.gallery) : null;
      } catch (error) {
        throw new Error('Invalid gallery format');
      }
    }
    if (dto.liveUrl !== undefined) {
      updateData.liveUrl = dto.liveUrl;
    }
    if (dto.githubUrl !== undefined) {
      updateData.githubUrl = dto.githubUrl;
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }
    if (dto.displayOrder !== undefined) {
      updateData.order = dto.displayOrder;
    }

    const [result] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return result;
  }

  async deleteProject(id: string) {
    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (!existing || existing.length === 0) {
      throw new NotFoundException('Project not found');
    }

    await db.delete(projects).where(eq(projects.id, id));

    return { message: 'Project deleted successfully' };
  }
}
