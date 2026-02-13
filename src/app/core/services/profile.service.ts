import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentProfile, PasswordChangeRequest, ProfileSettingsRequest, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<AgentProfile> {
    return this.http.get<AgentProfile>(`${this.base}/profile`);
  }

  updateProfile(request: Partial<AgentProfile>): Observable<AgentProfile> {
    return this.http.put<AgentProfile>(`${this.base}/profile`, request);
  }

  changePassword(request: PasswordChangeRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/profile/password`, request);
  }

  updateSettings(request: ProfileSettingsRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/profile/settings`, request);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard/stats`);
  }
}
