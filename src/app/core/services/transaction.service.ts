import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, CashInRequest, CashOutRequest, TransactionResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAccounts(clientId?: string, phone?: string): Observable<Account[]> {
    let params = new HttpParams();
    if (clientId) params = params.set('clientId', clientId);
    if (phone) params = params.set('phone', phone);
    return this.http.get<Account[]>(`${this.base}/accounts`, { params });
  }

  cashIn(request: CashInRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/transactions/cash-in`, request);
  }

  cashOut(request: CashOutRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/transactions/cash-out`, request);
  }
}
