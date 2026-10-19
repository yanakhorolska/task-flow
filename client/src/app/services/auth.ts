import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  birthDate: string | null;
  progress: { total: number; completed: number; percent: number };
}
type LoginResponse = Pick<CurrentUser, 'id' | 'name' | 'email'> & { accessToken: string };
const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly tokenKey = 'taskflow-access-token';
  private readonly tokenState = signal<string | null>(sessionStorage.getItem(this.tokenKey));
  readonly token = this.tokenState.asReadonly();
  readonly currentUser = signal<CurrentUser | null>(null);
  readonly isAuthenticated = () => !!this.tokenState();

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${API}/auth/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${API}/auth/login`, data).pipe(
      tap((result) => {
        sessionStorage.setItem(this.tokenKey, result.accessToken);
        this.tokenState.set(result.accessToken);
      }),
    );
  }

  loadProfile() {
    return this.http.get<CurrentUser>(`${API}/users/me`).pipe(
      tap(profile => this.currentUser.set(profile)),
    );
  }

  updateProfile(data: { name?: string; bio?: string | null; avatarUrl?: string | null; birthDate?: string | null }) {
    return this.http.patch<CurrentUser>(`${API}/users/me`, data).pipe(
      tap(profile => this.currentUser.set(profile)),
    );
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
    this.tokenState.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
