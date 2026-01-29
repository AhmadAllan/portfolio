import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMediaFolder } from '@portfolio/shared-types';

export interface FolderTreeNode extends IMediaFolder {
  fileCount: number;
  children: FolderTreeNode[];
}

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="folder-tree">
      <div
        class="folder-tree__item"
        [class.folder-tree__item--selected]="selectedId === null"
        (click)="onSelect(null)"
      >
        <svg class="folder-tree__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="folder-tree__name">All Files</span>
      </div>

      @for (folder of folders; track folder.id) {
        <ng-container *ngTemplateOutlet="folderTemplate; context: { $implicit: folder, level: 0 }"></ng-container>
      }

      <button class="folder-tree__add" (click)="onCreateFolder()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Folder
      </button>
    </div>

    <ng-template #folderTemplate let-folder let-level="level">
      <div
        class="folder-tree__item"
        [class.folder-tree__item--selected]="selectedId === folder.id"
        [style.padding-inline-start.rem]="0.75 + level * 1"
        (click)="onSelect(folder.id)"
      >
        <svg class="folder-tree__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span class="folder-tree__name">{{ folder.name }}</span>
        <span class="folder-tree__count">{{ folder.fileCount }}</span>
      </div>
      @if (folder.children && folder.children.length > 0) {
        @for (child of folder.children; track child.id) {
          <ng-container *ngTemplateOutlet="folderTemplate; context: { $implicit: child, level: level + 1 }"></ng-container>
        }
      }
    </ng-template>
  `,
  styles: [`
    .folder-tree {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .folder-tree__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm, 0.25rem);
      cursor: pointer;
      transition: background var(--transition-fast, 150ms);
    }

    .folder-tree__item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .folder-tree__item--selected {
      background: rgba(74, 74, 228, 0.2);
    }

    .folder-tree__icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      color: var(--color-text-muted, #a1a1aa);
    }

    .folder-tree__item--selected .folder-tree__icon {
      color: var(--color-glow, #7f7fff);
    }

    .folder-tree__name {
      flex: 1;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .folder-tree__count {
      font-size: 0.75rem;
      color: var(--color-text-muted, #a1a1aa);
      background: rgba(255, 255, 255, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full, 9999px);
    }

    .folder-tree__add {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      margin-top: 0.5rem;
      background: transparent;
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-sm, 0.25rem);
      color: var(--color-text-muted, #a1a1aa);
      cursor: pointer;
      font-size: 0.875rem;
      transition: border-color var(--transition-fast, 150ms), color var(--transition-fast, 150ms);
    }

    .folder-tree__add:hover {
      border-color: var(--color-tentacle, #4a4ae4);
      color: var(--color-text, #fff);
    }

    .folder-tree__add svg {
      width: 1rem;
      height: 1rem;
    }
  `],
})
export class FolderTreeComponent {
  @Input() folders: FolderTreeNode[] = [];
  @Input() selectedId: string | null = null;

  @Output() folderSelect = new EventEmitter<string | null>();
  @Output() createFolder = new EventEmitter<void>();

  onSelect(folderId: string | null): void {
    this.folderSelect.emit(folderId);
  }

  onCreateFolder(): void {
    this.createFolder.emit();
  }
}
