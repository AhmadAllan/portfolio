import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IJSendSuccess, IMediaFile, IMediaFolder } from '@portfolio/shared-types';

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface UploadResult {
  type: 'progress' | 'complete';
  progress?: UploadProgress;
  file?: IMediaFile;
}

export interface MediaListResponse {
  files: IMediaFile[];
}

export interface FolderListResponse {
  folders: (IMediaFolder & { fileCount: number })[];
}

export interface FolderTreeNode extends IMediaFolder {
  fileCount: number;
  children: FolderTreeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly apiUrl = '/api/v1/admin/media';

  constructor(private http: HttpClient) {}

  /**
   * Upload a file with progress tracking
   */
  uploadFile(
    file: File,
    folderId?: string,
    altText?: string,
    altTextEn?: string
  ): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    if (altText) formData.append('altText', altText);
    if (altTextEn) formData.append('altTextEn', altTextEn);

    return this.http
      .post<IJSendSuccess<{ file: IMediaFile }>>(`${this.apiUrl}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
        withCredentials: true,
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            return {
              type: 'progress' as const,
              progress: {
                progress: event.total ? Math.round((event.loaded / event.total) * 100) : 0,
                loaded: event.loaded,
                total: event.total || 0,
              },
            };
          }
          if (event.type === HttpEventType.Response) {
            return {
              type: 'complete' as const,
              file: event.body?.data?.file,
            };
          }
          return { type: 'progress' as const, progress: { progress: 0, loaded: 0, total: 0 } };
        })
      );
  }

  /**
   * Get files, optionally filtered by folder
   */
  getFiles(folderId?: string | null): Observable<IMediaFile[]> {
    const params: any = {};
    if (folderId === null) {
      params.root = 'true';
    } else if (folderId) {
      params.folderId = folderId;
    }

    return this.http
      .get<IJSendSuccess<MediaListResponse>>(this.apiUrl, {
        params,
        withCredentials: true,
      })
      .pipe(map((res) => res.data.files));
  }

  /**
   * Get a single file
   */
  getFile(id: string): Observable<IMediaFile> {
    return this.http
      .get<IJSendSuccess<{ file: IMediaFile }>>(`${this.apiUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data.file));
  }

  /**
   * Update file metadata
   */
  updateFile(
    id: string,
    data: { altText?: string; altTextEn?: string; caption?: string; captionEn?: string; folderId?: string }
  ): Observable<IMediaFile> {
    return this.http
      .put<IJSendSuccess<{ file: IMediaFile }>>(`${this.apiUrl}/${id}`, data, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data.file));
  }

  /**
   * Delete a file
   */
  deleteFile(id: string): Observable<void> {
    return this.http
      .delete<IJSendSuccess<{ message: string }>>(`${this.apiUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(map(() => void 0));
  }

  /**
   * Get folders
   */
  getFolders(parentId?: string | null): Observable<(IMediaFolder & { fileCount: number })[]> {
    const params: any = {};
    if (parentId === null) {
      params.root = 'true';
    } else if (parentId) {
      params.parentId = parentId;
    }

    return this.http
      .get<IJSendSuccess<FolderListResponse>>(`${this.apiUrl}/folders`, {
        params,
        withCredentials: true,
      })
      .pipe(map((res) => res.data.folders));
  }

  /**
   * Get folder tree
   */
  getFolderTree(): Observable<FolderTreeNode[]> {
    return this.http
      .get<IJSendSuccess<{ folders: FolderTreeNode[] }>>(`${this.apiUrl}/folders/tree`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data.folders));
  }

  /**
   * Create a folder
   */
  createFolder(name: string, parentId?: string): Observable<IMediaFolder & { fileCount: number }> {
    return this.http
      .post<IJSendSuccess<{ folder: IMediaFolder & { fileCount: number } }>>(
        `${this.apiUrl}/folders`,
        { name, parentId },
        { withCredentials: true }
      )
      .pipe(map((res) => res.data.folder));
  }

  /**
   * Update a folder
   */
  updateFolder(id: string, data: { name?: string; parentId?: string }): Observable<IMediaFolder> {
    return this.http
      .put<IJSendSuccess<{ folder: IMediaFolder }>>(`${this.apiUrl}/folders/${id}`, data, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data.folder));
  }

  /**
   * Delete a folder
   */
  deleteFolder(id: string): Observable<void> {
    return this.http
      .delete<IJSendSuccess<{ message: string }>>(`${this.apiUrl}/folders/${id}`, {
        withCredentials: true,
      })
      .pipe(map(() => void 0));
  }
}
