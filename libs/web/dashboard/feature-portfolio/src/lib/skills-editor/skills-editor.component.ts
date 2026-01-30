import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService, ISkill } from '@portfolio/dashboard/data-access';

@Component({
  selector: 'app-skills-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './skills-editor.component.html',
  styleUrls: ['./skills-editor.component.scss']
})
export class SkillsEditorComponent implements OnInit {
  skillsForm: FormGroup;
  skills: ISkill[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  editingId: string | null = null;

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.skillsForm = this.fb.group({
      name: ['', Validators.required],
      nameEn: [''],
      category: ['languages', Validators.required],
      icon: [''],
      displayOrder: [0, Validators.min(0)]
    });

    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.error = null;
    this.portfolioService.getSkills().subscribe({
      next: (data) => {
        this.skills = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load skills';
        this.loading = false;
      }
    });
  }

  editSkill(skill: ISkill): void {
    this.editingId = skill.id;
    this.skillsForm.patchValue({
      name: skill.name,
      nameEn: skill.nameEn || '',
      category: skill.category,
      icon: skill.icon,
      displayOrder: skill.displayOrder
    });
  }

  createSkill(): void {
    if (this.skillsForm.invalid) {
      this.skillsForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      name: this.skillsForm.value.name!,
      nameEn: this.skillsForm.value.nameEn || undefined,
      category: this.skillsForm.value.category!,
      icon: this.skillsForm.value.icon || undefined,
      displayOrder: this.skillsForm.value.displayOrder!
    };

    this.portfolioService.createSkill(data).subscribe({
      next: () => {
        this.saving = false;
        this.loadSkills();
      },
      error: (err) => {
        this.error = 'Failed to create skill';
        this.saving = false;
      }
    });
  }

  updateSkill(): void {
    if (this.skillsForm.invalid || !this.editingId) {
      this.skillsForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const data = {
      name: this.skillsForm.value.name!,
      nameEn: this.skillsForm.value.nameEn || undefined,
      category: this.skillsForm.value.category!,
      icon: this.skillsForm.value.icon || undefined,
      displayOrder: this.skillsForm.value.displayOrder!
    };

    this.portfolioService.updateSkill(this.editingId!, data).subscribe({
      next: () => {
        this.saving = false;
        this.editingId = null;
        this.loadSkills();
      },
      error: (err) => {
        this.error = 'Failed to update skill';
        this.saving = false;
      }
    });
  }

  deleteSkill(id: string): void {
    this.portfolioService.deleteSkill(id).subscribe({
      next: () => {
        this.loadSkills();
      },
      error: (err) => {
        this.error = 'Failed to delete skill';
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.skillsForm.reset();
  }
}
