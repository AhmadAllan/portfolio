import { Component, model, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-seo-fields',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seo-fields.component.html',
  styleUrls: ['./seo-fields.component.scss'],
})
export class SeoFieldsComponent {
  // Use model() for two-way bindable fields
  readonly metaTitle = model('');
  readonly metaTitleEn = model('');
  readonly metaDescription = model('');
  readonly metaDescriptionEn = model('');
  readonly ogImage = model('');

  // Regular inputs
  readonly showLanguageToggle = input(true);
  readonly currentLanguage = input<'en' | 'ar'>('en');

  // Computed signal for language state
  readonly isEnglish = computed(() => this.currentLanguage() === 'en');

  // Outputs (still needed if parent needs change events beyond two-way binding)
  readonly metaTitleChange = output<string>();
  readonly metaTitleEnChange = output<string>();
  readonly metaDescriptionChange = output<string>();
  readonly metaDescriptionEnChange = output<string>();
  readonly ogImageChange = output<string>();

  onMetaTitleChange(value: string) {
    this.metaTitle.set(value);
    this.metaTitleChange.emit(value);
  }

  onMetaTitleEnChange(value: string) {
    this.metaTitleEn.set(value);
    this.metaTitleEnChange.emit(value);
  }

  onMetaDescriptionChange(value: string) {
    this.metaDescription.set(value);
    this.metaDescriptionChange.emit(value);
  }

  onMetaDescriptionEnChange(value: string) {
    this.metaDescriptionEn.set(value);
    this.metaDescriptionEnChange.emit(value);
  }

  onOgImageChange(value: string) {
    this.ogImage.set(value);
    this.ogImageChange.emit(value);
  }
}
