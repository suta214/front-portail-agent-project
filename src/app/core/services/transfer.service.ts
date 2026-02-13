import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransferRequest, TransactionResponse, BeneficiaryVerification } from '../models';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  verifyBeneficiary(phone: string): Observable<BeneficiaryVerification> {
    return this.http.get<BeneficiaryVerification>(`${this.base}/wallets/verify`, {
      params: new HttpParams().set('phone', phone)
    });
  }

  initiateTransfer(request: TransferRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.base}/transfers`, request);
  }
}
