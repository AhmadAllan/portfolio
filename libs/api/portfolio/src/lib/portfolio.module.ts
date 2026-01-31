import { Module } from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ExperienceController } from './experience/experience.controller';
import { ExperienceService } from './experience/experience.service';
import { SkillController } from './skill/skill.controller';
import { SkillService } from './skill/skill.service';
import { EducationController } from './education/education.controller';
import { EducationService } from './education/education.service';

@Module({
  controllers: [
    AboutController,
    ProjectController,
    ExperienceController,
    SkillController,
    EducationController,
  ],
  providers: [
    AboutService,
    ProjectService,
    ExperienceService,
    SkillService,
    EducationService,
  ],
  exports: [
    AboutService,
    ProjectService,
    ExperienceService,
    SkillService,
    EducationService,
  ],
})
export class PortfolioModule {}
