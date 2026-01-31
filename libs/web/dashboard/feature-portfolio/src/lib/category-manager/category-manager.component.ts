import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ElementRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BlogService, ICategory } from '@portfolio/dashboard/data-access';

interface CategoryForm {
  id: string | null;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  parentId: string | null;
}

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  private blogService = inject(BlogService);
  private fb = inject(FormBuilder);

  // Template reference
  readonly formContainer = viewChild<ElementRef>('formContainer');

  // State
  categories = signal<ICategory[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal(false);
  isEditing = signal(false);
  currentLanguage = signal<'en' | 'ar'>('en');

  // Form
  categoryForm: FormGroup = this.fb.group({
    id: [null as string | null],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    name: ['', Validators.required],
    nameEn: ['', Validators.required],
    description: [''],
    descriptionEn: [''],
    parentId: [null as string | null]
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.blogService.getCategories());
      this.categories.set(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched(this.categoryForm);
      return;
    }

    this.isSaving.set(true);
    const formValue = this.categoryForm.value as CategoryForm;

    try {
      if (formValue.id) {
        // Update existing category
        const updateData = {
          name: formValue.name,
          nameEn: formValue.nameEn,
          description: formValue.description,
          descriptionEn: formValue.descriptionEn,
          parentId: formValue.parentId
        };
        await firstValueFrom(
          this.blogService.updateCategory(formValue.id, updateData)
        );
      } else {
        // Create new category
        const createData = {
          slug: formValue.slug,
          name: formValue.name,
          nameEn: formValue.nameEn,
          description: formValue.description,
          descriptionEn: formValue.descriptionEn,
          parentId: formValue.parentId
        };
        await firstValueFrom(this.blogService.createCategory(createData));
      }

      this.resetForm();
      await this.loadCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save category. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  editCategory(category: ICategory): void {
    this.isEditing.set(true);
    this.categoryForm.patchValue({
      id: category.id,
      slug: category.slug,
      name: category.name,
      nameEn: category.nameEn,
      description: category.description || '',
      descriptionEn: category.descriptionEn || '',
      parentId: category.parentId || null
    });
    this.formContainer()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async deleteCategory(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    this.isDeleting.set(true);
    try {
      await firstValueFrom(this.blogService.deleteCategory(id));
      await this.loadCategories();
      // If we were editing this category, reset the form
      if (this.categoryForm.value.id === id) {
        this.resetForm();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Please try again.');
    } finally {
      this.isDeleting.set(false);
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing.set(false);
    this.categoryForm.reset({
      id: null,
      slug: '',
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      parentId: null
    });
    this.categoryForm.markAsPristine();
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

  getRootCategories(): ICategory[] {
    return this.categories().filter(c => !c.parentId);
  }

  getChildCategories(parentId: string): ICategory[] {
    return this.categories().filter(c => c.parentId === parentId);
  }

  getCategoryPath(category: ICategory): string {
    if (!category.parentId) {
      return category.name;
    }
    const parent = this.categories().find(c => c.id === category.parentId);
    if (!parent) {
      return category.name;
    }
    return `${this.getCategoryPath(parent)} > ${category.name}`;
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
