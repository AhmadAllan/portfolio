import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-dropzone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="dropzone"
      [class.dropzone--active]="isDragging"
      [class.dropzone--uploading]="isUploading"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileSelect($event)"
        class="dropzone__input"
      />

      @if (isUploading) {
        <div class="dropzone__progress">
          <div class="dropzone__progress-bar" [style.width.%]="uploadProgress"></div>
          <span class="dropzone__progress-text">{{ uploadProgress }}%</span>
        </div>
      } @else {
        <div class="dropzone__content">
          <svg class="dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="dropzone__text">{{ isDragging ? 'Drop files here' : 'Click or drag files to upload' }}</p>
          <p class="dropzone__hint">Max file size: 10MB</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dropzone {
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md, 0.5rem);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: border-color var(--transition-fast, 150ms), background var(--transition-fast, 150ms);
    }

    .dropzone:hover,
    .dropzone--active {
      border-color: var(--color-tentacle, #4a4ae4);
      background: rgba(74, 74, 228, 0.1);
    }

    .dropzone--uploading {
      cursor: default;
      pointer-events: none;
    }

    .dropzone__input {
      display: none;
    }

    .dropzone__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .dropzone__icon {
      width: 3rem;
      height: 3rem;
      color: var(--color-text-muted, #a1a1aa);
    }

    .dropzone__text {
      font-size: 1rem;
      color: var(--color-text, #fff);
    }

    .dropzone__hint {
      font-size: 0.875rem;
      color: var(--color-text-muted, #a1a1aa);
    }

    .dropzone__progress {
      position: relative;
      height: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-sm, 0.25rem);
      overflow: hidden;
    }

    .dropzone__progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: var(--color-tentacle, #4a4ae4);
      transition: width 0.3s ease;
    }

    .dropzone__progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.875rem;
      font-weight: 500;
    }
  `],
})
export class UploadDropzoneComponent {
  @Input() accept = 'image/*';
  @Input() multiple = true;
  @Input() isUploading = false;
  @Input() uploadProgress = 0;

  @Output() filesSelected = new EventEmitter<File[]>();

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.emitFiles(files);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.emitFiles(input.files);
      input.value = ''; // Reset input
    }
  }

  private emitFiles(fileList: FileList): void {
    const files = Array.from(fileList);
    this.filesSelected.emit(files);
  }
}
