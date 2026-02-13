import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-cash-out',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cashout-root">
      <!-- Page Header -->
      <header class="page-header">
        <div class="page-header__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
            <line x1="2" y1="20" x2="2.01" y2="20"></line>
          </svg>
        </div>
        <div class="page-header__text">
          <h2>Cash Out</h2>
          <p class="page-header__subtitle">Retrait d'especes du wallet client</p>
        </div>
      </header>

      <!-- Notice Banner -->
      <div class="notice">
        <div class="notice__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <span>Verifier le KYC et les plafonds avant validation.</span>
      </div>

      <!-- Step 1: Client Identification -->
      <section class="card">
        <div class="card-header">
          <div class="card-header__left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="card-header__title">Identification client</span>
          </div>
          <div class="card-header__right">
            <div class="kyc-badge" [class.kyc-badge--verified]="kycVerified">
              @if (kycVerified) {
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              <span>KYC: {{ kycVerified ? 'Verifie' : 'Non verifie' }}</span>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-col">
            <div class="form-group">
              <label class="form-label">N de telephone <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <input [(ngModel)]="phone" placeholder="+216 XX XXX XXX" class="form-input form-input--with-icon" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">N piece d'identite</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                <input [(ngModel)]="idNumber" placeholder="Numero CIN" class="form-input form-input--with-icon" />
              </div>
            </div>
          </div>

          <div class="form-col">
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input [(ngModel)]="lastName" placeholder="Nom du client" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Prenom</label>
              <input [(ngModel)]="firstName" placeholder="Prenom du client" class="form-input" />
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn--primary" (click)="searchClient()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Rechercher
          </button>
          <button class="btn btn--secondary" (click)="clearIdentification()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Vider la page
          </button>
        </div>
      </section>

      <!-- Step 2: Account Details -->
      <section class="card">
        <div class="card-header">
          <div class="card-header__left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span class="card-header__title">Details comptes</span>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>RIB</th>
                <th>Identifiant</th>
                <th>Type</th>
                <th>Solde</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @if (!accounts || accounts.length === 0) {
                <tr>
                  <td colspan="5" class="table-empty">
                    <div class="table-empty__content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <span>Aucun enregistrement trouve.</span>
                    </div>
                  </td>
                </tr>
              }
              @for (a of accounts; track a.rib) {
                <tr>
                  <td><span class="cell-mono">{{ a.rib }}</span></td>
                  <td>{{ a.accountId }}</td>
                  <td><span class="status-badge status-badge--info">{{ a.accountType }}</span></td>
                  <td><strong>{{ a.balance }}</strong></td>
                  <td>
                    <button class="btn btn--select" (click)="selectAccount(a)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Selectionner
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Step 3: Transaction Details -->
      <section class="card">
        <div class="card-header">
          <div class="card-header__left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span class="card-header__title">Details transaction</span>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-col">
            <div class="form-group">
              <label class="form-label">Identifiant du compte</label>
              <input [value]="selectedAccount?.id || ''" readonly class="form-input form-input--readonly" />
            </div>

            <div class="form-group">
              <label class="form-label">Solde disponible</label>
              <input [value]="selectedAccount?.balance || ''" readonly class="form-input form-input--readonly" />
            </div>
          </div>

          <div class="form-col">
            <div class="form-group">
              <label class="form-label">Montant a retirer <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <input [(ngModel)]="amount" type="number" class="form-input form-input--with-icon" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Frais</label>
              <input [(ngModel)]="fee" type="number" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Montant net</label>
              <input [value]="computeNet()" readonly class="form-input form-input--highlight" />
            </div>
          </div>
        </div>

        <!-- Limits Info -->
        <div class="limits-bar">
          <div class="limits-bar__item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="limits-bar__label">Plafond agent:</span>
            <strong class="limits-bar__value">{{ agentLimit || '--' }}</strong>
          </div>
          <div class="limits-bar__separator"></div>
          <div class="limits-bar__item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="limits-bar__label">Plafond client:</span>
            <strong class="limits-bar__value">{{ clientLimit || '--' }}</strong>
          </div>
        </div>

        @if (errorMsg) {
          <div class="alert alert--error">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>{{ errorMsg }}</span>
          </div>
        }
        @if (successMsg) {
          <div class="alert alert--success">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ successMsg }}</span>
          </div>
        }

        <div class="card-actions">
          <button class="btn btn--primary" [disabled]="!canSubmit() || isLoading" (click)="submitTransaction()">
            @if (isLoading) {
              <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Traitement...
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Valider
            }
          </button>
          <button class="btn btn--secondary" (click)="clearTransaction()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Vider
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      padding: 24px 32px;
      background: var(--bg-primary, #F1F5F9);
      min-height: 100%;
    }

    /* ===== Page Header ===== */
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .page-header__icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg, 12px);
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
    }
    .page-header__text h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
    }
    .page-header__subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--text-secondary, #475569);
    }

    /* ===== Notice Banner ===== */
    .notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--warning-bg, #FFFBEB);
      border-left: 4px solid var(--warning, #D97706);
      color: var(--text-primary, #0F172A);
      padding: 14px 18px;
      border-radius: 0 var(--radius-md, 8px) var(--radius-md, 8px) 0;
      margin-bottom: 24px;
      font-size: 14px;
      line-height: 1.5;
    }
    .notice__icon {
      flex-shrink: 0;
      color: var(--warning, #D97706);
      margin-top: 1px;
    }

    /* ===== Card ===== */
    .card {
      background: var(--bg-card, #FFFFFF);
      border-radius: var(--radius-lg, 12px);
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04));
      border: 1px solid var(--border-light, #E2E8F0);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-light, #E2E8F0);
    }
    .card-header__left {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-primary, #0F172A);
    }
    .card-header__left svg {
      color: var(--hps-orange, #E8471B);
    }
    .card-header__title {
      font-weight: 700;
      font-size: 16px;
    }

    /* ===== KYC Badge ===== */
    .kyc-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-xl, 9999px);
      font-size: 13px;
      font-weight: 600;
      background: var(--error-bg, #FEF2F2);
      color: var(--error, #DC2626);
      border: 1px solid rgba(220, 38, 38, 0.15);
    }
    .kyc-badge--verified {
      background: var(--success-bg, #ECFDF5);
      color: var(--success, #059669);
      border-color: rgba(5, 150, 105, 0.15);
    }

    /* ===== Form Grid ===== */
    .form-grid {
      display: flex;
      gap: 24px;
    }
    .form-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary, #475569);
      letter-spacing: 0.01em;
    }
    .required {
      color: var(--hps-red, #C8102E);
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      color: var(--text-muted, #94A3B8);
      pointer-events: none;
      z-index: 1;
    }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-input, #F8FAFC);
      color: var(--text-primary, #0F172A);
      font-size: 14px;
      transition: var(--transition-fast, all 0.15s ease);
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: var(--hps-orange, #E8471B);
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
      background: #fff;
    }
    .form-input--with-icon {
      padding-left: 38px;
    }
    .form-input--readonly {
      background: var(--bg-primary, #F1F5F9);
      color: var(--text-secondary, #475569);
      cursor: default;
    }
    .form-input--highlight {
      background: var(--bg-primary, #F1F5F9);
      font-weight: 700;
      color: var(--text-primary, #0F172A);
      cursor: default;
    }

    /* ===== Table ===== */
    .table-container {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .data-table thead th {
      background: var(--bg-primary, #F1F5F9);
      color: var(--text-secondary, #475569);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 2px solid var(--border-light, #E2E8F0);
    }
    .data-table tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-light, #E2E8F0);
      color: var(--text-primary, #0F172A);
      vertical-align: middle;
    }
    .data-table tbody tr:hover {
      background: var(--bg-input, #F8FAFC);
    }
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    .table-empty {
      text-align: center;
      padding: 32px 16px !important;
    }
    .table-empty__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--text-muted, #94A3B8);
    }
    .cell-mono {
      font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
      font-size: 13px;
      color: var(--text-secondary, #475569);
    }

    /* ===== Status Badges ===== */
    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: var(--radius-xl, 9999px);
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge--info {
      background: var(--info-bg, #EFF6FF);
      color: var(--info, #2563EB);
    }

    /* ===== Limits Bar ===== */
    .limits-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 16px;
      padding: 12px 18px;
      background: var(--bg-primary, #F1F5F9);
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
    }
    .limits-bar__item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary, #475569);
      font-size: 14px;
    }
    .limits-bar__item svg {
      color: var(--text-muted, #94A3B8);
    }
    .limits-bar__label {
      font-weight: 500;
    }
    .limits-bar__value {
      color: var(--text-primary, #0F172A);
    }
    .limits-bar__separator {
      width: 1px;
      height: 20px;
      background: var(--border-light, #E2E8F0);
    }

    /* ===== Alerts ===== */
    .alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-md, 8px);
      margin-top: 16px;
      font-size: 14px;
      font-weight: 500;
    }
    .alert--error {
      background: var(--error-bg, #FEF2F2);
      color: var(--error, #DC2626);
      border-left: 4px solid var(--error, #DC2626);
    }
    .alert--success {
      background: var(--success-bg, #ECFDF5);
      color: var(--success, #059669);
      border-left: 4px solid var(--success, #059669);
    }

    /* ===== Buttons ===== */
    .card-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border-light, #E2E8F0);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--radius-md, 8px);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast, all 0.15s ease);
      border: none;
      outline: none;
    }
    .btn--primary {
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      color: #fff;
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06));
    }
    .btn--primary:hover:not(:disabled) {
      box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
      transform: translateY(-1px);
    }
    .btn--primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn--secondary {
      background: transparent;
      color: var(--text-secondary, #475569);
      border: 1px solid var(--border-light, #E2E8F0);
    }
    .btn--secondary:hover {
      background: var(--bg-primary, #F1F5F9);
      border-color: var(--text-muted, #94A3B8);
    }
    .btn--select {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-md, 8px);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--hps-orange, #E8471B);
      color: var(--hps-orange, #E8471B);
      background: transparent;
      transition: var(--transition-fast, all 0.15s ease);
    }
    .btn--select:hover {
      background: var(--hps-orange, #E8471B);
      color: #fff;
    }

    /* ===== Spinner ===== */
    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ===== Responsive ===== */
    @media (max-width: 800px) {
      :host { padding: 16px; }
      .form-grid { flex-direction: column; }
      .limits-bar { flex-direction: column; gap: 10px; }
      .limits-bar__separator { width: 100%; height: 1px; }
      .page-header__icon { width: 44px; height: 44px; }
    }
    `
  ]
})
export class CashOutComponent {
  phone = '';
  idNumber = '';
  lastName = '';
  firstName = '';

  accounts: Array<any> = [];
  selectedAccount: any = null;
  amount = 0;
  fee = 0;
  kycVerified = false;
  agentLimit: number | null = null;
  clientLimit: number | null = null;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private clientService: ClientService, private transactionService: TransactionService) {}

  searchClient() {
    if (!this.phone) { this.errorMsg = 'Veuillez saisir un numéro de téléphone'; return; }
    this.errorMsg = '';
    this.clientService.searchByPhone(this.phone).subscribe({
      next: (client) => {
        this.lastName = client.lastName;
        this.firstName = client.firstName;
        this.kycVerified = client.kycVerified;
        this.loadAccounts();
      },
      error: (err) => (this.errorMsg = err?.error?.message || 'Client introuvable')
    });
  }

  loadAccounts() {
    this.transactionService.getAccounts(undefined, this.phone).subscribe({
      next: (data) => (this.accounts = data),
      error: () => (this.errorMsg = 'Impossible de charger les comptes')
    });
  }

  clearIdentification() {
    this.phone = ''; this.idNumber = ''; this.lastName = ''; this.firstName = '';
    this.accounts = []; this.selectedAccount = null; this.kycVerified = false;
    this.errorMsg = ''; this.successMsg = '';
  }

  selectAccount(a: any) { this.selectedAccount = a; }

  computeNet() {
    const net = (Number(this.amount) || 0) - (Number(this.fee) || 0);
    return net > 0 ? net.toFixed(3) : '';
  }

  canSubmit() {
    if (!this.selectedAccount || !this.kycVerified) return false;
    const amt = Number(this.amount) || 0;
    if (amt <= 0) return false;
    if (this.clientLimit !== null && amt > this.clientLimit) return false;
    return true;
  }

  submitTransaction() {
    if (!this.canSubmit()) { this.errorMsg = 'Vérifiez KYC, compte sélectionné et montants'; return; }
    this.isLoading = true;
    this.errorMsg = '';
    this.transactionService.cashOut({ accountId: this.selectedAccount.accountId, amount: this.amount, fees: this.fee, clientPhone: this.phone }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = `Retrait validé — Réf: ${res.transactionId}`;
        this.clearTransaction();
      },
      error: (err) => { this.isLoading = false; this.errorMsg = err?.error?.message || 'Erreur lors du retrait'; }
    });
  }

  clearTransaction() { this.amount = 0; this.fee = 0; this.selectedAccount = null; }
}
