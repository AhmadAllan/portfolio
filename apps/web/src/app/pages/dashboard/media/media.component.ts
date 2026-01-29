import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { IMediaFile } from '@portfolio/shared-types';
import {
  MediaService,
  FolderTreeNode,
  UploadDropzoneComponent,
  MediaGridComponent,
  MediaDetailComponent,
  FolderTreeComponent,
  MediaMetadataUpdate,
} from '@portfolio/web-shared';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [
    CommonModule,
    UploadDropzoneComponent,
    MediaGridComponent,
    MediaDetailComponent,
    FolderTreeComponent,
  ],
  template: `
    <div class="media-page">
      <header class="media-page__header">
        <h1>Media Library</h1>
        <div class="media-page__actions">
          <button class="media-page__btn" (click)="onCreateFolder()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            New Folder
          </button>
        </div>
      </header>

      <div class="media-page__content">
        <aside class="media-page__sidebar">
          <app-folder-tree
            [folders]="folderTree"
            [selectedId]="currentFolderId"
            (folderSelect)="onFolderSelect($event)"
            (createFolder)="onCreateFolder()"
          ></app-folder-tree>
        </aside>

        <main class="media-page__main">
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

        @if (selectedFile) {
          <aside class="media-page__detail">
            <app-media-detail
              [file]="selectedFile"
              [isSaving]="isSaving"
              [isDeleting]="isDeleting"
              (save)="onSaveMetadata($event)"
              (delete)="onDeleteFile()"
            ></app-media-detail>
          </aside>
        }
      </div>
    </div>
  `,
  styles: [`
    .media-page {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .media-page__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 2rem;
      border-block-end: 1px solid rgba(255, 255, 255, 0.1);
    }

    .media-page__header h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    .media-page__btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--color-tentacle, #4a4ae4);
      border: none;
      border-radius: var(--radius-sm, 0.25rem);
      color: #fff;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .media-page__btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .media-page__content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .media-page__sidebar {
      width: 220px;
      padding: 1rem;
      border-inline-end: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    }

    .media-page__main {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .media-page__detail {
      width: 320px;
      border-inline-start: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    }
  `],
})
export class MediaComponent implements OnInit, OnDestroy {
  files: IMediaFile[] = [];
  folderTree: FolderTreeNode[] = [];
  currentFolderId: string | null = null;
  selectedFile: IMediaFile | null = null;
  isUploading = false;
  uploadProgress = 0;
  isSaving = false;
  isDeleting = false;

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
  }

  onFilesSelected(files: File[]): void {
    if (files.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Upload files sequentially
    this.uploadNextFile(files, 0);
  }

  private uploadNextFile(files: File[], index: number): void {
    if (index >= files.length) {
      this.isUploading = false;
      this.loadFiles();
      return;
    }

    this.mediaService.uploadFile(files[index], this.currentFolderId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.type === 'progress' && result.progress) {
            const fileProgress = result.progress.progress;
            this.uploadProgress = ((index + fileProgress / 100) / files.length) * 100;
          }
          if (result.type === 'complete') {
            this.uploadNextFile(files, index + 1);
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

  onSaveMetadata(metadata: MediaMetadataUpdate): void {
    if (!this.selectedFile) return;

    this.isSaving = true;
    this.mediaService.updateFile(this.selectedFile.id, metadata)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedFile) => {
          this.isSaving = false;
          this.selectedFile = updatedFile;
          this.loadFiles();
        },
        error: () => {
          this.isSaving = false;
        },
      });
  }

  onDeleteFile(): void {
    if (!this.selectedFile) return;

    this.isDeleting = true;
    this.mediaService.deleteFile(this.selectedFile.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.selectedFile = null;
          this.loadFiles();
        },
        error: () => {
          this.isDeleting = false;
        },
      });
  }
}
