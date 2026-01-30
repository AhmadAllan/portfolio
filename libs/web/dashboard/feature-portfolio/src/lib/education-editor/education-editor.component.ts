import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService, IEducation } from '@portfolio/dashboard/data-access';

@Component({
  selector: 'app-education-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './education-editor.component.html',
  styleUrls: ['./education-editor.component.scss']
})
export class EducationEditorComponent implements OnInit {
  educationForm: FormGroup;
  education: IEducation[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  editingId: string | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.educationForm = this.fb.group({
      institution: ['', Validators.required],
      institutionEn: [''],
      degree: ['', Validators.required],
      degreeEn: [''],
      field: ['', Validators.required],
      fieldEn: [''],
      year: ['', Validators.required, Validators.min(1900), Validators.max(2100)],
      type: ['degree', Validators.required],
      description: [''],
      descriptionEn: [''],
      displayOrder: [0, Validators.min(0)]
    });

    this.loadEducation();
  }

  loadEducation(): void {
    this.loading = true;
    this.error = null;
    const subscription = this.portfolioService.getEducations().subscribe({
      next: (data) => {
        this.education = data;
        this.loading = false;
      },
      error: (_err) => {
        this.error = 'Failed to load education';
        this.loading = false;
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  editEducation(edu: IEducation): void {
    this.editingId = edu.id;
    this.educationForm.patchValue({
      institution: edu.institution,
      institutionEn: edu.institutionEn || '',
      degree: edu.degree,
      degreeEn: edu.degreeEn || '',
      field: edu.field,
      fieldEn: edu.fieldEn || '',
      year: edu.year,
      type: edu.type,
      description: edu.description,
      descriptionEn: edu.descriptionEn || '',
      displayOrder: edu.displayOrder
    });
  }

  createEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      institution: this.educationForm.value.institution!,
      institutionEn: this.educationForm.value.institutionEn || undefined,
      degree: this.educationForm.value.degree!,
      degreeEn: this.educationForm.value.degreeEn || undefined,
      field: this.educationForm.value.field!,
      fieldEn: this.educationForm.value.fieldEn || undefined,
      year: this.educationForm.value.year!,
      type: this.educationForm.value.type!,
      description: this.educationForm.value.description!,
      descriptionEn: this.educationForm.value.descriptionEn || undefined,
      displayOrder: this.educationForm.value.displayOrder!
    };

    const subscription = this.portfolioService.createEducation(data).subscribe({
      next: () => {
        this.saving = false;
        this.loadEducation();
      },
      error: (_err) => {
        this.error = 'Failed to create education';
        this.saving = false;
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  updateEducation(): void {
    if (this.educationForm.invalid || !this.editingId) {
      this.educationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      institution: this.educationForm.value.institution!,
      institutionEn: this.educationForm.value.institutionEn || undefined,
      degree: this.educationForm.value.degree!,
      degreeEn: this.educationForm.value.degreeEn || undefined,
      field: this.educationForm.value.field!,
      fieldEn: this.educationForm.value.fieldEn || undefined,
      year: this.educationForm.value.year!,
      type: this.educationForm.value.type!,
      description: this.educationForm.value.description!,
      descriptionEn: this.educationForm.value.descriptionEn || undefined,
      displayOrder: this.educationForm.value.displayOrder!
    };

    const subscription = this.portfolioService.updateEducation(this.editingId!, data).subscribe({
      next: () => {
        this.saving = false;
        this.editingId = null;
        this.loadEducation();
      },
      error: (_err) => {
        this.error = 'Failed to update education';
        this.saving = false;
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteEducation(id: string): void {
    const subscription = this.portfolioService.deleteEducation(id).subscribe({
      next: () => {
        this.loadEducation();
      },
      error: (_err) => {
        this.error = 'Failed to delete education';
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  cancelEdit(): void {
    this.editingId = null;
    this.educationForm.reset();
  }
}
