import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAgentRequest, CreatedAgent } from '../models';

@Injectable({ providedIn: 'root' })
export class AgentManagementService {
  private baseUrl = `${environment.apiUrl}/agents`;

  constructor(private http: HttpClient) {}

  createAgent(request: CreateAgentRequest): Observable<{ message: string; agent: CreatedAgent }> {
    return this.http.post<{ message: string; agent: CreatedAgent }>(this.baseUrl, request);
  }

  getAgents(): Observable<CreatedAgent[]> {
    return this.http.get<CreatedAgent[]>(this.baseUrl);
  }

  generateIdentifiant(): string {
    return 'PR-' + Math.floor(100000 + Math.random() * 900000);
  }
}
