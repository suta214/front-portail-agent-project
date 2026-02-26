import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentType, LoginRequest, LoginResponse, Privilege } from '../models';
import { PrivilegeService } from './privilege.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'agent_token';
  private readonly AGENT_KEY = 'agent_info';
  private readonly MCP_KEY = 'mustChangePassword';
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private http: HttpClient,
    private router: Router,
    private privilegeService: PrivilegeService,
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.AGENT_KEY, JSON.stringify(response));
          localStorage.setItem(this.MCP_KEY, String(response.mustChangePassword));
        }
        this.privilegeService.setFromLogin(
          response.agentType as AgentType,
          response.privileges as Privilege[],
        );
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.AGENT_KEY);
      localStorage.removeItem(this.MCP_KEY);
    }
    this.privilegeService.reset();
    this.router.navigate(['/login']);
  }

  isMustChangePassword(): boolean {
    return this.isBrowser ? localStorage.getItem(this.MCP_KEY) === 'true' : false;
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
