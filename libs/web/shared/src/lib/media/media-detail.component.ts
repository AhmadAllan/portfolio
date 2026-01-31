import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMediaFile } from '@portfolio/shared-types';

export interface MediaMetadataUpdate {
  altText?: string;
  altTextEn?: string;
  caption?: string;
  captionEn?: string;
}

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (file) {
      <div class="media-detail">
        <div class="media-detail__preview">
          @if (isImage) {
            <img [src]="file.path" [alt]="file.altText || file.originalFilename" />
          } @else {
            <div class="media-detail__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          }
        </div>

        <div class="media-detail__info">
          <h3 class="media-detail__filename">{{ file.originalFilename }}</h3>
          <dl class="media-detail__meta">
            <dt>Size</dt>
            <dd>{{ formatSize(file.size) }}</dd>
            <dt>Type</dt>
            <dd>{{ file.mimeType }}</dd>
            @if (file.width && file.height) {
              <dt>Dimensions</dt>
              <dd>{{ file.width }} × {{ file.height }}</dd>
            }
            <dt>Uploaded</dt>
            <dd>{{ file.createdAt | date:'medium' }}</dd>
          </dl>
        </div>

        <form class="media-detail__form" (ngSubmit)="onSave()">
          <div class="media-detail__field">
            <label for="altText">Alt Text (Arabic)</label>
            <input
              type="text"
              id="altText"
              [(ngModel)]="formData.altText"
              name="altText"
              placeholder="وصف الصورة"
            />
          </div>

          <div class="media-detail__field">
            <label for="altTextEn">Alt Text (English)</label>
            <input
              type="text"
              id="altTextEn"
              [(ngModel)]="formData.altTextEn"
              name="altTextEn"
              placeholder="Image description"
            />
          </div>

          <div class="media-detail__field">
            <label for="caption">Caption (Arabic)</label>
            <textarea
              id="caption"
              [(ngModel)]="formData.caption"
              name="caption"
              rows="2"
              placeholder="تعليق الصورة"
            ></textarea>
          </div>

          <div class="media-detail__field">
            <label for="captionEn">Caption (English)</label>
            <textarea
              id="captionEn"
              [(ngModel)]="formData.captionEn"
              name="captionEn"
              rows="2"
              placeholder="Image caption"
            ></textarea>
          </div>

          <div class="media-detail__actions">
            <button type="submit" class="media-detail__btn media-detail__btn--primary" [disabled]="isSaving">
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              class="media-detail__btn media-detail__btn--danger"
              (click)="onDelete()"
              [disabled]="isDeleting"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </form>

        <div class="media-detail__url">
          <label>URL</label>
          <div class="media-detail__url-input">
            <input type="text" [value]="getFullUrl()" readonly #urlInput />
            <button type="button" (click)="copyUrl(urlInput)">Copy</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .media-detail {
      padding: 1rem;
    }

    .media-detail__preview {
      background: var(--color-void, #0a0a0f);
      border-radius: var(--radius-md, 0.5rem);
      overflow: hidden;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .media-detail__preview img {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
    }

    .media-detail__icon {
      width: 4rem;
      height: 4rem;
      color: var(--color-text-muted, #a1a1aa);
    }

    .media-detail__icon svg {
      width: 100%;
      height: 100%;
    }

    .media-detail__filename {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      word-break: break-all;
    }

    .media-detail__meta {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.25rem 0.75rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .media-detail__meta dt {
      color: var(--color-text-muted, #a1a1aa);
    }

    .media-detail__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .media-detail__field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .media-detail__field label {
      font-size: 0.875rem;
      color: var(--color-text-muted, #a1a1aa);
    }

    .media-detail__field input,
    .media-detail__field textarea {
      padding: 0.5rem;
      background: var(--color-void, #0a0a0f);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-sm, 0.25rem);
      color: var(--color-text, #fff);
      font-size: 0.875rem;
    }

    .media-detail__field input:focus,
    .media-detail__field textarea:focus {
      outline: none;
      border-color: var(--color-tentacle, #4a4ae4);
    }

    .media-detail__actions {
      display: flex;
      gap: 0.5rem;
    }

    .media-detail__btn {
      flex: 1;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--radius-sm, 0.25rem);
      cursor: pointer;
      font-size: 0.875rem;
      transition: opacity var(--transition-fast, 150ms);
    }

    .media-detail__btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .media-detail__btn--primary {
      background: var(--color-tentacle, #4a4ae4);
      color: #fff;
    }

    .media-detail__btn--danger {
      background: #dc2626;
      color: #fff;
    }

    .media-detail__url {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .media-detail__url label {
      display: block;
      font-size: 0.875rem;
      color: var(--color-text-muted, #a1a1aa);
      margin-bottom: 0.25rem;
    }

    .media-detail__url-input {
      display: flex;
      gap: 0.5rem;
    }

    .media-detail__url-input input {
      flex: 1;
      padding: 0.5rem;
      background: var(--color-void, #0a0a0f);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-sm, 0.25rem);
      color: var(--color-text, #fff);
      font-size: 0.75rem;
    }

    .media-detail__url-input button {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: var(--radius-sm, 0.25rem);
      color: var(--color-text, #fff);
      cursor: pointer;
      font-size: 0.75rem;
    }
  `],
})
export class MediaDetailComponent implements OnChanges {
  @Input() file: IMediaFile | null = null;
  @Input() isSaving = false;
  @Input() isDeleting = false;

  @Output() save = new EventEmitter<MediaMetadataUpdate>();
  @Output() delete = new EventEmitter<void>();

  formData: MediaMetadataUpdate = {};

  get isImage(): boolean {
    return this.file?.fileType === 'image';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && this.file) {
      this.formData = {
        altText: this.file.altText || '',
        altTextEn: this.file.altTextEn || '',
        caption: this.file.caption || '',
        captionEn: this.file.captionEn || '',
      };
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getFullUrl(): string {
    if (!this.file) return '';
    return `${window.location.origin}${this.file.path}`;
  }

  copyUrl(input: HTMLInputElement): void {
    input.select();
    navigator.clipboard.writeText(input.value);
  }

  onSave(): void {
    this.save.emit(this.formData);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.delete.emit();
    }
  }
}
