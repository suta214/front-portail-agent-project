import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction, TransactionFilters, PaginatedTransactions } from '../models';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly base = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(filters?: TransactionFilters): Observable<PaginatedTransactions> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.dateRange) params = params.set('dateRange', filters.dateRange);
    if (filters?.page) params = params.set('page', String(filters.page));
    if (filters?.pageSize) params = params.set('pageSize', String(filters.pageSize));
    return this.http.get<PaginatedTransactions>(this.base, { params });
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.base}/${id}`);
  }
}
