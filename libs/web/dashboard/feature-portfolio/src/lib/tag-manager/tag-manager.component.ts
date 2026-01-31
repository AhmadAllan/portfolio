import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ElementRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BlogService, ITag } from '@portfolio/dashboard/data-access';

interface TagForm {
  id: string | null;
  slug: string;
  name: string;
  nameEn: string;
}

@Component({
  selector: 'app-tag-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tag-manager.component.html',
  styleUrls: ['./tag-manager.component.scss']
})
export class TagManagerComponent implements OnInit {
  private blogService = inject(BlogService);
  private fb = inject(FormBuilder);

  // Template reference
  readonly formContainer = viewChild<ElementRef>('formContainer');

  // State
  tags = signal<ITag[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal(false);
  isEditing = signal(false);
  currentLanguage = signal<'en' | 'ar'>('en');

  // Form
  tagForm: FormGroup = this.fb.group({
    id: [null as string | null],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    name: ['', Validators.required],
    nameEn: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadTags();
  }

  async loadTags(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.blogService.getTags());
      this.tags.set(data || []);
    } catch (err) {
      console.error('Failed to load tags:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.tagForm.invalid) {
      this.markFormGroupTouched(this.tagForm);
      return;
    }

    this.isSaving.set(true);
    const formValue = this.tagForm.value as TagForm;

    try {
      if (formValue.id) {
        // Update existing tag
        const updateData = {
          name: formValue.name,
          nameEn: formValue.nameEn
        };
        await firstValueFrom(this.blogService.updateTag(formValue.id, updateData));
      } else {
        // Create new tag
        const createData = {
          slug: formValue.slug,
          name: formValue.name,
          nameEn: formValue.nameEn
        };
        await firstValueFrom(this.blogService.createTag(createData));
      }

      this.resetForm();
      await this.loadTags();
    } catch (err) {
      console.error('Failed to save tag:', err);
      alert('Failed to save tag. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  editTag(tag: ITag): void {
    this.isEditing.set(true);
    this.tagForm.patchValue({
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
      nameEn: tag.nameEn
    });
    this.formContainer()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async deleteTag(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }

    this.isDeleting.set(true);
    try {
      await firstValueFrom(this.blogService.deleteTag(id));
      await this.loadTags();
      // If we were editing this tag, reset the form
      if (this.tagForm.value.id === id) {
        this.resetForm();
      }
    } catch (err) {
      console.error('Failed to delete tag:', err);
      alert('Failed to delete tag. Please try again.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing.set(false);
    this.tagForm.reset({
      id: null,
      slug: '',
      name: '',
      nameEn: ''
    });
    this.tagForm.markAsPristine();
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
