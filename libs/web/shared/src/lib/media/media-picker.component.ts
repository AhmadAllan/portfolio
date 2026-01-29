import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { IMediaFile } from '@portfolio/shared-types';
import { MediaService, FolderTreeNode } from './media.service';
import { MediaGridComponent } from './media-grid.component';
import { FolderTreeComponent } from './folder-tree.component';
import { UploadDropzoneComponent } from './upload-dropzone.component';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule, MediaGridComponent, FolderTreeComponent, UploadDropzoneComponent],
  template: `
    @if (isOpen) {
      <div class="media-picker__overlay" (click)="close()"></div>
      <div class="media-picker">
        <div class="media-picker__header">
          <h2>Select Media</h2>
          <button class="media-picker__close" (click)="close()" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="media-picker__content">
          <aside class="media-picker__sidebar">
            <app-folder-tree
              [folders]="folderTree"
              [selectedId]="currentFolderId"
              (folderSelect)="onFolderSelect($event)"
              (createFolder)="onCreateFolder()"
            ></app-folder-tree>
          </aside>

          <main class="media-picker__main">
            <app-upload-dropzone
              [isUploading]="isUploading"
              [uploadProgress]="uploadProgress"
              (filesSelected)="onFilesSelected($event)"
            ></app-upload-dropzone>

            <app-media-grid
              [files]="files"
              [selectedId]="selectedFile?.id || null"
              (fileSelect)="onFileSelect($event)"
              (fileOpen)="onFileOpen($event)"
            ></app-media-grid>
          </main>
        </div>

        <div class="media-picker__footer">
          <button class="media-picker__btn media-picker__btn--secondary" (click)="close()">
            Cancel
          </button>
          <button
            class="media-picker__btn media-picker__btn--primary"
            [disabled]="!selectedFile"
            (click)="confirm()"
          >
            Select
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .media-picker__overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 100;
    }

    .media-picker {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90vw;
      max-width: 1000px;
      height: 80vh;
      background: var(--color-deep, #1a1a2e);
      border-radius: var(--radius-lg, 1rem);
      z-index: 101;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .media-picker__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .media-picker__header h2 {
      font-size: 1.25rem;
      margin: 0;
    }

    .media-picker__close {
      padding: 0.5rem;
      background: transparent;
      border: none;
      color: var(--color-text-muted, #a1a1aa);
      cursor: pointer;
      border-radius: var(--radius-sm, 0.25rem);
    }

    .media-picker__close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text, #fff);
    }

    .media-picker__close svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .media-picker__content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .media-picker__sidebar {
      width: 200px;
      padding: 1rem;
      border-inline-end: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    }

    .media-picker__main {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .media-picker__footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .media-picker__btn {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: var(--radius-sm, 0.25rem);
      font-size: 0.875rem;
      cursor: pointer;
      transition: opacity var(--transition-fast, 150ms);
    }

    .media-picker__btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .media-picker__btn--primary {
      background: var(--color-tentacle, #4a4ae4);
      color: #fff;
    }

    .media-picker__btn--secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text, #fff);
    }
  `],
})
export class MediaPickerComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() fileSelected = new EventEmitter<IMediaFile>();
  @Output() closed = new EventEmitter<void>();

  files: IMediaFile[] = [];
  folderTree: FolderTreeNode[] = [];
  currentFolderId: string | null = null;
  selectedFile: IMediaFile | null = null;
  isUploading = false;
  uploadProgress = 0;

  private destroy$ = new Subject<void>();

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.loadFolderTree();
    this.loadFiles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFolderTree(): void {
    this.mediaService.getFolderTree()
      .pipe(takeUntil(this.destroy$))
      .subscribe((folders) => {
        this.folderTree = folders;
      });
  }

  loadFiles(): void {
    this.mediaService.getFiles(this.currentFolderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((files) => {
        this.files = files;
      });
  }

  onFolderSelect(folderId: string | null): void {
    this.currentFolderId = folderId;
    this.selectedFile = null;
    this.loadFiles();
  }

  onFileSelect(file: IMediaFile): void {
    this.selectedFile = file;
  }

  onFileOpen(file: IMediaFile): void {
    this.selectedFile = file;
    this.confirm();
  }

  onFilesSelected(files: File[]): void {
    if (files.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Upload first file (for simplicity)
    this.mediaService.uploadFile(files[0], this.currentFolderId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.type === 'progress' && result.progress) {
            this.uploadProgress = result.progress.progress;
          }
          if (result.type === 'complete' && result.file) {
            this.isUploading = false;
            this.loadFiles();
          }
        },
        error: () => {
          this.isUploading = false;
        },
      });
  }

  onCreateFolder(): void {
    const name = prompt('Enter folder name:');
    if (name) {
      this.mediaService.createFolder(name, this.currentFolderId || undefined)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadFolderTree();
        });
    }
  }

  confirm(): void {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
