import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../../shared/models/auth';
import { BaseApiResponse } from '../../shared/models/base.api.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(credentials: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, credentials);
  }

  login(credentials: LoginRequest): Observable<BaseApiResponse<LoginResponse>> {
    return this.http.post<BaseApiResponse<LoginResponse>>(`${this.apiUrl}/auth/login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  removeToken(): void {
    localStorage.removeItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
