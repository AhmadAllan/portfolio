import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJSendResponse } from '@portfolio/shared-types';
import { ENVIRONMENT, Environment } from '../config/environment.token';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpClient {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    this.apiUrl = this.env.apiUrl;
  }

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
