import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

export interface BilingualField {
  arControl: FormControl<string | null>;
  enControl: FormControl<string | null>;
  label: string;
  arPlaceholder?: string;
  enPlaceholder?: string;
  arRequired?: boolean;
  enRequired?: boolean;
  type?: 'text' | 'textarea' | 'email' | 'url';
}

@Component({
  selector: 'lib-bilingual-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bilingual-form.component.html',
  styleUrls: ['./bilingual-form.component.scss']
})
export class BilingualFormComponent {
  @Input() fields: BilingualField[] = [];
  @Input() arLabel = 'Arabic';
  @Input() enLabel = 'English';
  @Input() arDirection = 'rtl';
  @Input() enDirection = 'ltr';
  @Output() fieldChange = new EventEmitter<{ index: number; lang: 'ar' | 'en'; value: string }>();

  onFieldChange(index: number, lang: 'ar' | 'en', value: string): void {
    this.fieldChange.emit({ index, lang, value });
  }

  get isTextarea(type?: string): boolean {
    return type === 'textarea';
  }

  getInputType(type?: string): string {
    return type === 'textarea' ? 'text' : (type || 'text');
  }
}
