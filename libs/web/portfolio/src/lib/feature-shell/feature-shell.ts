import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HeroComponent } from '../hero';
import { AboutComponent } from '../about';
import { ExperienceComponent } from '../experience';
import { ProjectsGridComponent } from '../projects-grid';
import { SkillsComponent } from '../skills';
import { EducationComponent } from '../education';
import { ContactComponent } from '../contact';
import { PortfolioDataService } from '../data-access/portfolio-data.service';

@Component({
  selector: 'lib-feature-shell',
  imports: [
    CommonModule,
    AsyncPipe,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsGridComponent,
    SkillsComponent,
    EducationComponent,
    ContactComponent
  ],
  templateUrl: './feature-shell.html',
  styleUrl: './feature-shell.css',
})
export class FeatureShell {
  about$ = this.portfolioDataService.getAbout();
  projects$ = this.portfolioDataService.getProjects();
  experience$ = this.portfolioDataService.getExperience();
  skills$ = this.portfolioDataService.getSkills();
  education$ = this.portfolioDataService.getEducation();
  contactInfo$ = this.portfolioDataService.getContactInfo();

  constructor(private portfolioDataService: PortfolioDataService) {}
}
