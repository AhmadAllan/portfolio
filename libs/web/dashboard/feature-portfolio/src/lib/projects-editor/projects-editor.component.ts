import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService, IProject } from '@portfolio/dashboard/data-access';

@Component({
  selector: 'app-projects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './projects-editor.component.html',
  styleUrls: ['./projects-editor.component.scss']
})
export class ProjectsEditorComponent implements OnInit {
  projectsForm: FormGroup;
  projects: IProject[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  editingId: string | null = null;

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectsForm = this.fb.group({
      title: ['', Validators.required],
      titleEn: [''],
      slug: ['', Validators.required, Validators.pattern('^[a-z0-9-]+$')],
      description: ['', Validators.required],
      descriptionEn: [''],
      thumbnail: ['', Validators.required],
      techStack: this.fb.array([''], Validators.required),
      role: [''],
      roleEn: [''],
      duration: [''],
      durationEn: [''],
      teamSize: [null, Validators.min(1)],
      challenges: [''],
      challengesEn: [''],
      liveUrl: [''],
      githubUrl: [''],
      gallery: this.fb.array([]),
      status: ['active', Validators.required],
      displayOrder: [0, Validators.min(0)],
      featured: [false]
    });

    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.portfolioService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects';
        this.loading = false;
      }
    });
  }

  editProject(project: IProject): void {
    this.editingId = project.id;
    this.projectsForm.patchValue({
      title: project.title,
      titleEn: project.titleEn || '',
      slug: project.slug,
      description: project.description,
      descriptionEn: project.descriptionEn || '',
      thumbnail: project.thumbnail,
      techStack: project.techStack,
      role: project.role,
      roleEn: project.roleEn || '',
      duration: project.duration,
      durationEn: project.durationEn || '',
      teamSize: project.teamSize,
      challenges: project.challenges,
      challengesEn: project.challengesEn || '',
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      gallery: project.gallery || [],
      status: project.status,
      displayOrder: project.displayOrder,
      featured: project.featured
    });
  }

  createProject(): void {
    if (this.projectsForm.invalid) {
      this.projectsForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      title: this.projectsForm.value.title!,
      titleEn: this.projectsForm.value.titleEn || undefined,
      slug: this.projectsForm.value.slug!,
      description: this.projectsForm.value.description!,
      descriptionEn: this.projectsForm.value.descriptionEn || undefined,
      thumbnail: this.projectsForm.value.thumbnail!,
      techStack: this.projectsForm.value.techStack!,
      role: this.projectsForm.value.role,
      roleEn: this.projectsForm.value.roleEn || undefined,
      duration: this.projectsForm.value.duration,
      durationEn: this.projectsForm.value.durationEn || undefined,
      teamSize: this.projectsForm.value.teamSize,
      challenges: this.projectsForm.value.challenges,
      challengesEn: this.projectsForm.value.challengesEn || undefined,
      liveUrl: this.projectsForm.value.liveUrl,
      githubUrl: this.projectsForm.value.githubUrl,
      gallery: this.projectsForm.value.gallery!,
      status: this.projectsForm.value.status!,
      displayOrder: this.projectsForm.value.displayOrder!,
      featured: this.projectsForm.value.featured!
    };

    this.portfolioService.createProject(data).subscribe({
      next: () => {
        this.saving = false;
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Failed to create project';
        this.saving = false;
      }
    });
  }

  updateProject(): void {
    if (this.projectsForm.invalid || !this.editingId) {
      this.projectsForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      title: this.projectsForm.value.title!,
      titleEn: this.projectsForm.value.titleEn || undefined,
      slug: this.projectsForm.value.slug!,
      description: this.projectsForm.value.description!,
      descriptionEn: this.projectsForm.value.descriptionEn || undefined,
      thumbnail: this.projectsForm.value.thumbnail!,
      techStack: this.projectsForm.value.techStack!,
      role: this.projectsForm.value.role,
      roleEn: this.projectsForm.value.roleEn || undefined,
      duration: this.projectsForm.value.duration,
      durationEn: this.projectsForm.value.durationEn || undefined,
      teamSize: this.projectsForm.value.teamSize,
      challenges: this.projectsForm.value.challenges,
      challengesEn: this.projectsForm.value.challengesEn || undefined,
      liveUrl: this.projectsForm.value.liveUrl,
      githubUrl: this.projectsForm.value.githubUrl,
      gallery: this.projectsForm.value.gallery!,
      status: this.projectsForm.value.status!,
      displayOrder: this.projectsForm.value.displayOrder!,
      featured: this.projectsForm.value.featured!
    };

    this.portfolioService.updateProject(this.editingId!, data).subscribe({
      next: () => {
        this.saving = false;
        this.editingId = null;
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Failed to update project';
        this.saving = false;
      }
    });
  }

  deleteProject(id: string): void {
    this.portfolioService.deleteProject(id).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Failed to delete project';
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.projectsForm.reset();
  }

  get techStack() {
    return this.projectsForm.get('techStack') as FormGroup[];
  }

  addTechStackItem(): void {
    this.techStack.push(this.fb.group({ value: ['', Validators.required] }));
  }

  removeTechStackItem(index: number): void {
    this.techStack.removeAt(index);
  }

  get gallery() {
    return this.projectsForm.get('gallery') as FormGroup[];
  }

  addGalleryItem(): void {
    this.gallery.push(this.fb.group({ value: ['', Validators.required] }));
  }

  removeGalleryItem(index: number): void {
    this.gallery.removeAt(index);
  }
}
