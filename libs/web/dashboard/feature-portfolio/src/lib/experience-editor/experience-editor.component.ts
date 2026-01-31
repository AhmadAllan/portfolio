import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService, IExperience } from '@portfolio/dashboard/data-access';

@Component({
  selector: 'app-experience-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './experience-editor.component.html',
  styleUrls: ['./experience-editor.component.scss']
})
export class ExperienceEditorComponent implements OnInit {
  experiencesForm: FormGroup;
  experiences: IExperience[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  editingId: string | null = null;

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.experiencesForm = this.fb.group({
      company: ['', Validators.required],
      companyEn: [''],
      title: ['', Validators.required],
      titleEn: [''],
      location: [''],
      locationEn: [''],
      type: ['full-time', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['', Validators.required],
      descriptionEn: [''],
      displayOrder: [0, Validators.min(0)]
    });

    this.loadExperiences();
  }

  loadExperiences(): void {
    this.loading = true;
    this.error = null;
    this.portfolioService.getExperiences().subscribe({
      next: (data) => {
        this.experiences = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load experiences';
        this.loading = false;
      }
    });
  }

  editExperience(exp: IExperience): void {
    this.editingId = exp.id;
    this.experiencesForm.patchValue({
      company: exp.company,
      companyEn: exp.companyEn || '',
      title: exp.title,
      titleEn: exp.titleEn || '',
      location: exp.location,
      locationEn: exp.locationEn || '',
      type: exp.type,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
      descriptionEn: exp.descriptionEn || '',
      displayOrder: exp.displayOrder
    });
  }

  createExperience(): void {
    if (this.experiencesForm.invalid) {
      this.experiencesForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      company: this.experiencesForm.value.company!,
      companyEn: this.experiencesForm.value.companyEn || undefined,
      title: this.experiencesForm.value.title!,
      titleEn: this.experiencesForm.value.titleEn || undefined,
      location: this.experiencesForm.value.location,
      locationEn: this.experiencesForm.value.locationEn || undefined,
      type: this.experiencesForm.value.type!,
      startDate: this.experiencesForm.value.startDate!,
      endDate: this.experiencesForm.value.endDate,
      current: this.experiencesForm.value.current!,
      description: this.experiencesForm.value.description!,
      descriptionEn: this.experiencesForm.value.descriptionEn || undefined,
      displayOrder: this.experiencesForm.value.displayOrder!
    };

    this.portfolioService.createExperience(data).subscribe({
      next: () => {
        this.saving = false;
        this.loadExperiences();
      },
      error: (err) => {
        this.error = 'Failed to create experience';
        this.saving = false;
      }
    });
  }

  updateExperience(): void {
    if (this.experiencesForm.invalid || !this.editingId) {
      this.experiencesForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      company: this.experiencesForm.value.company!,
      companyEn: this.experiencesForm.value.companyEn || undefined,
      title: this.experiencesForm.value.title!,
      titleEn: this.experiencesForm.value.titleEn || undefined,
      location: this.experiencesForm.value.location,
      locationEn: this.experiencesForm.value.locationEn || undefined,
      type: this.experiencesForm.value.type!,
      startDate: this.experiencesForm.value.startDate!,
      endDate: this.experiencesForm.value.endDate,
      current: this.experiencesForm.value.current!,
      description: this.experiencesForm.value.description!,
      descriptionEn: this.experiencesForm.value.descriptionEn || undefined,
      displayOrder: this.experiencesForm.value.displayOrder!
    };

    this.portfolioService.updateExperience(this.editingId!, data).subscribe({
      next: () => {
        this.saving = false;
        this.editingId = null;
        this.loadExperiences();
      },
      error: (err) => {
        this.error = 'Failed to update experience';
        this.saving = false;
      }
    });
  }

  deleteExperience(id: string): void {
    this.portfolioService.deleteExperience(id).subscribe({
      next: () => {
        this.loadExperiences();
      },
      error: (err) => {
        this.error = 'Failed to delete experience';
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.experiencesForm.reset();
  }
}
