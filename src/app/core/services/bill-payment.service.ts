import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice, BillPaymentRequest, TransactionResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class BillPaymentService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getInvoice(billerId: string, customerRef: string, contractNumber?: string): Observable<Invoice> {
    let params = new HttpParams()
      .set('billerId', billerId)
      .set('customerRef', customerRef);
    if (contractNumber) params = params.set('contractNumber', contractNumber);
    return this.http.get<Invoice>(`${this.base}/invoices`, { params });
  }

  payBill(request: BillPaymentRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/payments/bills`, request);
  }
}
