import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ElementRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BlogService, ISeries } from '@portfolio/dashboard/data-access';

interface SeriesForm {
  id: string | null;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

@Component({
  selector: 'app-series-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './series-manager.component.html',
  styleUrls: ['./series-manager.component.scss']
})
export class SeriesManagerComponent implements OnInit {
  private blogService = inject(BlogService);
  private fb = inject(FormBuilder);

  // Template reference
  readonly formContainer = viewChild<ElementRef>('formContainer');

  // State
  series = signal<ISeries[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal(false);
  isEditing = signal(false);
  currentLanguage = signal<'en' | 'ar'>('en');

  // Form
  seriesForm: FormGroup = this.fb.group({
    id: [null as string | null],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    title: ['', Validators.required],
    titleEn: ['', Validators.required],
    description: [''],
    descriptionEn: ['']
  });

  ngOnInit(): void {
    this.loadSeries();
  }

  async loadSeries(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.blogService.getSeries());
      this.series.set(data || []);
    } catch (err) {
      console.error('Failed to load series:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.seriesForm.invalid) {
      this.markFormGroupTouched(this.seriesForm);
      return;
    }

    this.isSaving.set(true);
    const formValue = this.seriesForm.value as SeriesForm;

    try {
      if (formValue.id) {
        // Update existing series
        const updateData = {
          title: formValue.title,
          titleEn: formValue.titleEn,
          description: formValue.description,
          descriptionEn: formValue.descriptionEn
        };
        await firstValueFrom(this.blogService.updateSeries(formValue.id, updateData));
      } else {
        // Create new series
        const createData = {
          slug: formValue.slug,
          title: formValue.title,
          titleEn: formValue.titleEn,
          description: formValue.description,
          descriptionEn: formValue.descriptionEn
        };
        await firstValueFrom(this.blogService.createSeries(createData));
      }

      this.resetForm();
      await this.loadSeries();
    } catch (err) {
      console.error('Failed to save series:', err);
      alert('Failed to save series. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  editSeries(serie: ISeries): void {
    this.isEditing.set(true);
    this.seriesForm.patchValue({
      id: serie.id,
      slug: serie.slug,
      title: serie.title,
      titleEn: serie.titleEn,
      description: serie.description || '',
      descriptionEn: serie.descriptionEn || ''
    });
    this.formContainer()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async deleteSeries(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this series? This action cannot be undone.')) {
      return;
    }

    this.isDeleting.set(true);
    try {
      await firstValueFrom(this.blogService.deleteSeries(id));
      await this.loadSeries();
      // If we were editing this series, reset the form
      if (this.seriesForm.value.id === id) {
        this.resetForm();
      }
    } catch (err) {
      console.error('Failed to delete series:', err);
      alert('Failed to delete series. Please try again.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing.set(false);
    this.seriesForm.reset({
      id: null,
      slug: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: ''
    });
    this.seriesForm.markAsPristine();
  }

  toggleLanguage(lang: 'en' | 'ar'): void {
    this.currentLanguage.set(lang);
  }

  isEnglish(): boolean {
    return this.currentLanguage() === 'en';
  }

  isArabic(): boolean {
    return this.currentLanguage() === 'ar';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
