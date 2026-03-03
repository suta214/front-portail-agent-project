import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<any>(`${this.base}/accounts`, { params }).pipe(
      map(res => Array.isArray(res) ? res : (res?.data ?? []))
    );
  }

  cashIn(request: CashInRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/transactions/cash-in`, request);
  }

  cashOut(request: CashOutRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/transactions/cash-out`, request);
  }
}
