import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wallet, CreateWalletRequest, WalletAction, WalletSearchParams } from '../models';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly base = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getWallets(params?: WalletSearchParams): Observable<Wallet[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.type) httpParams = httpParams.set('type', params.type);
    return this.http.get<Wallet[]>(this.base, { params: httpParams });
  }

  getWalletById(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.base}/${id}`);
  }

  verifyWallet(phone: string): Observable<{ name: string; phone: string; type: string; walletId: string }> {
    return this.http.get<{ name: string; phone: string; type: string; walletId: string }>(
      `${this.base}/verify`,
      { params: new HttpParams().set('phone', phone) }
    );
  }

  createWallet(request: CreateWalletRequest): Observable<Wallet> {
    return this.http.post<Wallet>(this.base, request);
  }

  updateWallet(id: number, request: Partial<Wallet>): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.base}/${id}`, request);
  }

  applyAction(id: number, action: WalletAction): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/${id}/actions`, action);
  }
}
