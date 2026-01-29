import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJSendResponse } from '@portfolio/shared-types';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpClient {
  private readonly apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: any): Observable<IJSendResponse<T>> {
    return this.http.get<IJSendResponse<T>>(`${this.apiUrl}${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<IJSendResponse<T>> {
    return this.http.post<IJSendResponse<T>>(`${this.apiUrl}${endpoint}`, body, options);
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<IJSendResponse<T>> {
    return this.http.put<IJSendResponse<T>>(`${this.apiUrl}${endpoint}`, body, options);
  }

  patch<T>(endpoint: string, body: any, options?: any): Observable<IJSendResponse<T>> {
    return this.http.patch<IJSendResponse<T>>(`${this.apiUrl}${endpoint}`, body, options);
  }

  delete<T>(endpoint: string, options?: any): Observable<IJSendResponse<T>> {
    return this.http.delete<IJSendResponse<T>>(`${this.apiUrl}${endpoint}`, options);
  }
}
