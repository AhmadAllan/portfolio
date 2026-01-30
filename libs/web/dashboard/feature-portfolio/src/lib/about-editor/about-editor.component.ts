import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService, IAbout } from '@portfolio/dashboard/data-access';

@Component({
  selector: 'app-about-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './about-editor.component.html',
  styleUrls: ['./about-editor.component.scss']
})
export class AboutEditorComponent implements OnInit {
  aboutForm: FormGroup;
  about: IAbout | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.aboutForm = this.fb.group({
      name: ['', Validators.required],
      nameEn: [''],
      title: ['', Validators.required],
      titleEn: [''],
      bio: ['', Validators.required],
      bioEn: [''],
      avatar: [''],
      email: ['', [Validators.required, Validators.email]],
      socialLinks: this.fb.array([])
    });

    this.loadAbout();
  }

  loadAbout(): void {
    this.loading = true;
    this.error = null;
    this.portfolioService.getAbout().subscribe({
      next: (data) => {
        this.about = data;
        this.aboutForm.patchValue({
          name: data.name,
          nameEn: data.nameEn || '',
          title: data.title,
          titleEn: data.titleEn || '',
          bio: data.bio,
          bioEn: data.bioEn || '',
          avatar: data.avatar || '',
          email: data.email,
          socialLinks: data.socialLinks || []
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load about information';
        this.loading = false;
      }
    });
  }

  saveAbout(): void {
    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      name: this.aboutForm.value.name!,
      nameEn: this.aboutForm.value.nameEn || undefined,
      title: this.aboutForm.value.title!,
      titleEn: this.aboutForm.value.titleEn || undefined,
      bio: this.aboutForm.value.bio!,
      bioEn: this.aboutForm.value.bioEn || undefined,
      avatar: this.aboutForm.value.avatar || undefined,
      email: this.aboutForm.value.email!,
      socialLinks: this.aboutForm.value.socialLinks!
    };

    this.portfolioService.updateAbout(this.about!.id, data).subscribe({
      next: () => {
        this.saving = false;
      },
      error: (err) => {
        this.error = 'Failed to save about information';
        this.saving = false;
      }
    });
  }

  get socialLinks() {
    return this.aboutForm.get('socialLinks') as FormGroup[];
  }

  addSocialLink(): void {
    const linkGroup = this.fb.group({
      platform: ['', Validators.required],
      url: ['', Validators.required, Validators.pattern('https?://.+')],
      displayOrder: [0, Validators.min(0)]
    });
    this.socialLinks.push(linkGroup);
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }
}
