import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMediaFile } from '@portfolio/shared-types';

@Component({
  selector: 'app-media-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-grid">
      @for (file of files; track file.id) {
        <div
          class="media-grid__item"
          [class.media-grid__item--selected]="selectedId === file.id"
          (click)="onSelect(file)"
          (dblclick)="onOpen(file)"
        >
          <div class="media-grid__preview">
            @if (isImage(file)) {
              <img
                [src]="file.thumbnailPath || file.path"
                [alt]="file.altText || file.originalFilename"
                loading="lazy"
              />
            } @else {
              <div class="media-grid__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
          </div>
          <div class="media-grid__info">
            <span class="media-grid__name" [title]="file.originalFilename">
              {{ file.originalFilename }}
            </span>
            <span class="media-grid__size">{{ formatSize(file.size) }}</span>
          </div>
        </div>
      } @empty {
        <div class="media-grid__empty">
          <p>No files in this folder</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .media-grid__item {
      background: var(--color-deep, #1a1a2e);
      border-radius: var(--radius-md, 0.5rem);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-fast, 150ms), box-shadow var(--transition-fast, 150ms);
      border: 2px solid transparent;
    }

    .media-grid__item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .media-grid__item--selected {
      border-color: var(--color-tentacle, #4a4ae4);
    }

    .media-grid__preview {
      aspect-ratio: 1;
      background: var(--color-void, #0a0a0f);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .media-grid__preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-grid__icon {
      width: 3rem;
      height: 3rem;
      color: var(--color-text-muted, #a1a1aa);
    }

    .media-grid__icon svg {
      width: 100%;
      height: 100%;
    }

    .media-grid__info {
      padding: 0.75rem;
    }

    .media-grid__name {
      display: block;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-grid__size {
      display: block;
      font-size: 0.75rem;
      color: var(--color-text-muted, #a1a1aa);
      margin-top: 0.25rem;
    }

    .media-grid__empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--color-text-muted, #a1a1aa);
    }
  `],
})
export class MediaGridComponent {
  @Input() files: IMediaFile[] = [];
  @Input() selectedId: string | null = null;

  @Output() fileSelect = new EventEmitter<IMediaFile>();
  @Output() fileOpen = new EventEmitter<IMediaFile>();

  isImage(file: IMediaFile): boolean {
    return file.fileType === 'image';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  onSelect(file: IMediaFile): void {
    this.fileSelect.emit(file);
  }

  onOpen(file: IMediaFile): void {
    this.fileOpen.emit(file);
  }
}
