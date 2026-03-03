import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Transaction, TransactionFilters, PaginatedTransactions } from '../models';

// Normalise un objet transaction quel que soit sa source (mock ou backend réel)
function normalizeTransaction(t: any): any {
  const TYPE_MAP: Record<string, string> = {
    'Cash In': 'cash-in', 'Cash Out': 'cash-out',
    'Transfert': 'transfer', 'Transfer': 'transfer',
    'Paiement': 'payment', 'Payment': 'payment',
  };
  const STATUS_MAP: Record<string, string> = {
    'SUCCES': 'success', 'SUCCESS': 'success', 'Réussi': 'success',
    'ECHEC': 'failed',  'FAILED': 'failed',  'Échoué': 'failed',
    'PENDING': 'pending', 'En attente': 'pending',
  };

  const rawDate = t.createdAt ?? t.date ?? '';
  let dateStr = t.date ?? '';
  let timeStr = t.time ?? '';
  if (rawDate && !t.date) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString('fr-FR');
      timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
  }

  return {
    id:          t.transactionId ?? t.id,
    type:        TYPE_MAP[t.type]   ?? t.type,
    client:      t.clientName       ?? t.client,
    amount:      t.amount,
    fees:        t.fees ?? t.fee ?? 0,
    status:      STATUS_MAP[t.status] ?? t.status,
    date:        dateStr,
    time:        timeStr,
    reference:   t.reference ?? '',
    description: t.description ?? t.reference ?? '',
    notes:       t.notes ?? t.description ?? '',
  };
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly base = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(filters?: TransactionFilters): Observable<PaginatedTransactions> {
    let params = new HttpParams();
    if (filters?.search)   params = params.set('search',   filters.search);
    if (filters?.type)     params = params.set('type',     filters.type);
    if (filters?.status)   params = params.set('status',   filters.status);
    if (filters?.dateRange) params = params.set('dateRange', filters.dateRange);
    params = params.set('page',     String(filters?.page ?? 1));
    params = params.set('pageSize', String(filters?.pageSize ?? 10));
    return this.http.get<any>(this.base, { params }).pipe(
      map(res => {
        const rawData: any[] = res.data ?? res.items ?? (Array.isArray(res) ? res : []);
        const data = rawData.map(normalizeTransaction);
        return {
          data,
          total:      res.total      ?? data.length,
          page:       res.page       ?? 1,
          pageSize:   res.pageSize   ?? 10,
          totalPages: res.totalPages ?? (Math.ceil((res.total ?? data.length) / 10) || 1),
        } as PaginatedTransactions;
      })
    );
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.base}/${id}`);
  }
}
