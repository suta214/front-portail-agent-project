import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'agent_token';
  private readonly AGENT_KEY = 'agent_info';
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.AGENT_KEY, JSON.stringify(response));
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.AGENT_KEY);
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isBrowser ? !!localStorage.getItem(this.TOKEN_KEY) : false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getAgentInfo(): LoginResponse | null {
    if (!this.isBrowser) return null;
    const info = localStorage.getItem(this.AGENT_KEY);
    return info ? JSON.parse(info) : null;
  }
}
