import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientEnrollRequest, ClientSearchParams } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly base = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(params?: ClientSearchParams): Observable<Client[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<Client[]>(this.base, { params: httpParams });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  searchByPhone(phone: string): Observable<Client> {
    return this.http.get<Client>(`${this.base}/search`, {
      params: new HttpParams().set('phone', phone)
    });
  }

  enrollClient(request: ClientEnrollRequest): Observable<Client> {
    return this.http.post<Client>(this.base, request);
  }

  updateClient(id: number, request: Partial<ClientEnrollRequest>): Observable<Client> {
    return this.http.put<Client>(`${this.base}/${id}`, request);
  }
}
