import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillPaymentService } from '../../core/services/bill-payment.service';
import { TranslationService } from '../../core/services/translation.service';
import { Invoice } from '../../core/models';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-bill-payments',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bills-root">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="url(#hdr-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 14l2 2 4-4" stroke="url(#hdr-grad2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="hdr-grad" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                <stop stop-color="#C8102E"/><stop offset="0.5" stop-color="#E8471B"/><stop offset="1" stop-color="#F7941D"/>
              </linearGradient>
              <linearGradient id="hdr-grad2" x1="9" y1="12" x2="15" y2="16" gradientUnits="userSpaceOnUse">
                <stop stop-color="#C8102E"/><stop offset="0.5" stop-color="#E8471B"/><stop offset="1" stop-color="#F7941D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h2>Paiement de factures</h2>
          <p class="lead">Payer les factures des clients via leur wallet</p>
        </div>
      </header>

      <!-- Info Notice -->
      <div class="notice">
        <svg class="notice-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="var(--info)" stroke-width="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="var(--info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Selectionnez un facturier pour consulter et payer les factures de vos clients.</span>
      </div>

      <!-- Billers Section -->
      <section class="billers-section">
        <h3 class="section-title">Selectionnez un facturier</h3>
        <div class="biller-grid">
          @for (b of billers; track b.key) {
            <button class="biller-card" [class.biller-selected]="selectedBiller?.key === b.key" (click)="selectBiller(b)">
              <div class="biller-icon">
                @if (b.logoSrc) {
                  <div class="biller-logo-wrap">
                    <img [src]="b.logoSrc" [alt]="b.name" class="biller-logo-img" />
                  </div>
                } @else {
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#EFF6FF"/>
                    <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#2563EB"/>
                  </svg>
                }
              </div>
              <div class="biller-name">{{ b.name }}</div>
              <div class="biller-desc">{{ b.desc }}</div>
              @if (selectedBiller?.key === b.key) {
                <div class="selected-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              }
            </button>
          }
        </div>
      </section>

      <!-- Payment Form -->
      @if (selectedBiller) {
        <section class="payment-section">
          <div class="payment-columns">

            <!-- Left: Form Card -->
            <div class="payment-card">
              <div class="payment-header">
                <div class="payment-header-icon">
                  @if (selectedBiller?.logoSrc) {
                    <div class="payment-logo-wrap">
                      <img [src]="selectedBiller.logoSrc" [alt]="selectedBiller.name" class="payment-logo-img" />
                    </div>
                  } @else {
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="24" fill="#EFF6FF"/>
                      <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#2563EB"/>
                    </svg>
                  }
                </div>
                <div class="payment-header-text">
                  <h3>{{ selectedBiller.name }}</h3>
                  <span class="payment-header-desc">{{ selectedBiller.desc }}</span>
                </div>
                <button class="btn-close-payment" (click)="clearPayment()" title="Fermer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="divider"></div>

              <div class="form-body">
                <!-- Wallet Client -->
                <div class="wallet-field">
                  <label class="wallet-label">Wallet Client</label>
                  <input class="wallet-input" [(ngModel)]="customerRef" placeholder="Numéro de wallet ou téléphone" />
                </div>

                <!-- Contract Number -->
                <div class="wallet-field">
                  <label class="wallet-label">Numéro de contrat / compteur</label>
                  <input class="wallet-input" [(ngModel)]="contractNumber" placeholder="Ex: 123456789" />
                </div>

                @if (errorMsg) {
                  <div class="alert alert-error">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--error)" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="var(--error)" stroke-width="2" stroke-linecap="round"/></svg>
                    <span>{{ errorMsg }}</span>
                  </div>
                }

                <button class="btn-consult" [disabled]="isLoading" (click)="fetchInvoice()">
                  @if (isLoading) {
                    <span class="spinner"></span> Recherche...
                  } @else {
                    Consulter la Facture
                  }
                </button>

                @if (successMsg) {
                  <div class="alert alert-success">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--success)" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke="var(--success)" stroke-width="2" stroke-linecap="round"/></svg>
                    <span>{{ successMsg }}</span>
                  </div>
                }

                <!-- Purple Invoice Card -->
                @if (invoice) {
                  <div class="invoice-purple-card">
                    <h4 class="ipc-title">Facture à Payer</h4>
                    <div class="ipc-row">
                      <span class="ipc-label">Facturier:</span>
                      <span class="ipc-value">{{ selectedBiller.name }}</span>
                    </div>
                    <div class="ipc-row">
                      <span class="ipc-label">Référence:</span>
                      <span class="ipc-value">{{ invoice.invoiceId }}</span>
                    </div>
                    <div class="ipc-row">
                      <span class="ipc-label">Période:</span>
                      <span class="ipc-value">{{ invoice.period }}</span>
                    </div>
                    <div class="ipc-row">
                      <span class="ipc-label">Echéance:</span>
                      <span class="ipc-value">{{ invoice.dueDate }}</span>
                    </div>
                    <div class="ipc-divider"></div>
                    <div class="ipc-row ipc-amount-row">
                      <span class="ipc-label">Montant Total:</span>
                      <span class="ipc-amount">{{ invoice.amount }} {{ ts.currentCurrency }}</span>
                    </div>
                    <button class="btn-confirm" [disabled]="isLoading" (click)="payInvoice()">
                      @if (isLoading) {
                        <span class="spinner spinner-dark"></span> Traitement...
                      } @else {
                        Confirmer le Paiement
                      }
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Right: Recent Payments -->
            <div class="recent-card">
              <h4 class="recent-title">Paiements Récents</h4>
              @if (recentPayments.length === 0) {
                <p class="recent-empty">Aucun paiement récent</p>
              }
              @for (p of recentPayments; track p.id) {
                <div class="recent-item">
                  <div class="recent-left">
                    <div class="recent-dot"></div>
                    <div class="recent-info">
                      <span class="recent-name">{{ p.biller }}</span>
                      <span class="recent-date">{{ p.date }}</span>
                    </div>
                  </div>
                  <span class="recent-amount">{{ p.amount }} {{ ts.currentCurrency }}</span>
                </div>
              }
            </div>

          </div>
        </section>
      }
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      padding: 24px 28px;
    }

    /* ---- Page Header ---- */
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .header-text h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .lead {
      margin: 4px 0 0;
      color: var(--text-secondary);
      font-size: 0.925rem;
    }

    /* ---- Notice ---- */
    .notice {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--info-bg);
      color: var(--info);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      border-left: 4px solid var(--info);
      margin-bottom: 28px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .notice-icon {
      flex-shrink: 0;
    }

    /* ---- Billers Section ---- */
    .billers-section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 16px;
    }
    .biller-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .biller-card {
      position: relative;
      background: var(--bg-card);
      border: 2px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 24px 16px 20px;
      text-align: center;
      cursor: pointer;
      transition: var(--transition-base);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .biller-card:hover {
      border-color: #E2E8F0;
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }
    .biller-card.biller-selected {
      border-color: var(--hps-red);
      box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12), var(--shadow-md);
    }
    .biller-icon {
      margin-bottom: 4px;
    }
    .biller-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .biller-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.35;
    }
    .selected-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      background: var(--hps-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fallback-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }
    .biller-logo-wrap {
      width: 64px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .biller-logo-img {
      max-width: 64px;
      max-height: 44px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    .payment-logo-wrap {
      width: 80px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .payment-logo-img {
      max-width: 80px;
      max-height: 44px;
      width: auto;
      height: auto;
      object-fit: contain;
    }

    /* ---- Payment Section ---- */
    .payment-section {
      margin-bottom: 28px;
    }
    .payment-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .payment-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 28px;
    }
    .payment-header-icon {
      flex-shrink: 0;
    }
    .payment-header-text h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .payment-header-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .divider {
      height: 1px;
      background: var(--border-light);
      margin: 0 28px;
    }

    /* ---- Form ---- */
    .form-body {
      padding: 24px 28px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .required {
      color: var(--hps-red);
    }
    .field-input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-input);
      font-size: 0.925rem;
      color: var(--text-primary);
      transition: var(--transition-fast);
      outline: none;
      box-sizing: border-box;
    }
    .field-input:focus {
      border-color: var(--hps-orange);
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
      background: var(--bg-card);
    }
    .field-input::placeholder {
      color: var(--text-muted);
    }

    /* ---- Buttons ---- */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: var(--radius-md);
      background: var(--hps-gradient);
      color: #fff;
      font-size: 0.925rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .btn-primary:hover {
      opacity: 0.92;
      box-shadow: var(--shadow-md);
    }
    .btn-outlined {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 0.925rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .btn-outlined:hover {
      border-color: var(--text-muted);
      background: var(--bg-primary);
    }

    /* ---- Alerts ---- */
    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      margin-top: 16px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .alert svg {
      flex-shrink: 0;
    }
    .alert-error {
      background: var(--error-bg);
      color: var(--error);
      border-left: 4px solid var(--error);
    }
    .alert-success {
      background: var(--success-bg);
      color: var(--success);
      border-left: 4px solid var(--success);
    }

    /* ---- Invoice Result ---- */
    .invoice-result {
      margin-top: 24px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-input);
    }
    .invoice-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 18px 24px;
      border-bottom: 1px solid var(--border-light);
      background: var(--bg-card);
    }
    .invoice-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .invoice-details {
      padding: 20px 24px;
    }
    .invoice-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .invoice-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .invoice-label {
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .invoice-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .invoice-amount {
      color: var(--hps-red);
      font-size: 1.1rem;
      font-weight: 800;
    }
    .invoice-action {
      padding: 0 24px 20px;
    }
    .btn-pay {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      border: none;
      border-radius: var(--radius-md);
      background: var(--hps-gradient);
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .btn-pay:hover:not(:disabled) {
      opacity: 0.92;
      box-shadow: var(--shadow-lg);
    }
    .btn-pay:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ---- Spinner ---- */
    .spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ---- New Payment Layout ---- */
    .payment-columns {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      align-items: start;
    }

    /* Close button in header */
    .btn-close-payment {
      margin-left: auto;
      width: 32px; height: 32px;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-input);
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0;
      transition: var(--transition-fast);
    }
    .btn-close-payment:hover { background: var(--error-bg); color: var(--error); border-color: var(--error); }

    /* Wallet fields */
    .wallet-field { margin-bottom: 16px; }
    .wallet-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .wallet-input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-input);
      font-size: 0.925rem;
      color: var(--text-primary);
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      transition: var(--transition-fast);
    }
    .wallet-input:focus {
      border-color: var(--hps-orange);
      box-shadow: 0 0 0 3px rgba(232,71,27,0.1);
      background: var(--bg-card);
    }
    .wallet-input::placeholder { color: var(--text-muted); }

    /* Consulter button */
    .btn-consult {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: var(--radius-md);
      background: #2563EB;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: var(--transition-fast);
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 8px;
    }
    .btn-consult:hover:not(:disabled) { background: #1D4ED8; box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
    .btn-consult:disabled { opacity: 0.55; cursor: not-allowed; }

    /* Invoice Card */
    .invoice-purple-card {
      margin-top: 20px;
      background: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%);
      border-radius: var(--radius-lg);
      padding: 24px;
      color: #fff;
    }
    .ipc-title {
      margin: 0 0 20px;
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
    }
    .ipc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    .ipc-label {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.7);
    }
    .ipc-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
    }
    .ipc-divider {
      height: 1px;
      background: rgba(255,255,255,0.2);
      margin: 12px 0;
    }
    .ipc-amount-row { padding: 4px 0; }
    .ipc-amount {
      font-size: 1.6rem;
      font-weight: 800;
      color: #fff;
    }
    .btn-confirm {
      width: 100%;
      margin-top: 20px;
      padding: 14px;
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.12);
      color: #fff;
      font-size: 0.975rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: var(--transition-fast);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-confirm:hover:not(:disabled) { background: rgba(255,255,255,0.25); }
    .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner-dark {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* Recent Payments Card */
    .recent-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 24px;
    }
    .recent-title {
      margin: 0 0 20px;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .recent-empty {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-align: center;
      padding: 16px 0;
    }
    .recent-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
    }
    .recent-item:last-child { border-bottom: none; }
    .recent-left { display: flex; align-items: center; gap: 12px; }
    .recent-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--hps-gradient);
      flex-shrink: 0;
    }
    .recent-info { display: flex; flex-direction: column; gap: 2px; }
    .recent-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
    .recent-date { font-size: 0.78rem; color: var(--text-muted); }
    .recent-amount { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }

    /* ---- Responsive ---- */
    @media (max-width: 1000px) {
      .biller-grid { grid-template-columns: repeat(2, 1fr); }
      .payment-columns { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      :host { padding: 16px; }
      .biller-grid { grid-template-columns: 1fr; }
    }
    `
  ]
})
export class BillPaymentsComponent {
  billers = [
    { key: 'onee', name: 'ONEE', desc: "Electricite & Eau", icon: '⚡', logoSrc: 'ONEE-LOGO.png' },
    { key: 'srm', name: 'SRM', desc: 'Eau & Electricite (Casablanca)', icon: '💧', logoSrc: '' },
    { key: 'oncf', name: 'ONCF', desc: 'Transport ferroviaire', icon: '🚆', logoSrc: 'oncf-logo-png.png' },
    { key: 'maroc-telecom', name: 'Maroc Telecom', desc: 'Telecommunications', icon: '📶', logoSrc: 'Nouveau-logo-de-Maroc-Telecom.png' },
    { key: 'orange', name: 'Orange Maroc', desc: 'Telephonie mobile', icon: '🟠', logoSrc: 'Orange_Morocco-Logo.wine.png' },
    { key: 'inwi', name: 'Inwi', desc: 'Telecommunications', icon: '📡', logoSrc: 'inwi-logo-png_seeklogo-215192.png' },
    { key: 'canalplus', name: 'Canal+', desc: 'Television', icon: '📺', logoSrc: 'canal logo.png' },
    { key: 'netflix', name: 'Netflix', desc: 'Streaming video', icon: '🎬', logoSrc: 'netflix-logo.png' }
  ];

  selectedBiller: any = null;
  customerRef = '';
  contractNumber = '';
  invoice: Invoice | null = null;
  fee = 0;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  recentPayments: { id: number; biller: string; date: string; amount: number }[] = [
    { id: 1, biller: 'Maroc Telecom', date: "Aujourd'hui", amount: 200 },
    { id: 2, biller: 'ONEE',          date: 'Hier',        amount: 320 },
    { id: 3, biller: 'Inwi',          date: '22 Jan',      amount: 150 },
  ];

  constructor(private billPaymentService: BillPaymentService, public ts: TranslationService) {}

  selectBiller(b: any) {
    this.selectedBiller = b;
    this.invoice = null;
    this.customerRef = '';
    this.contractNumber = '';
    this.errorMsg = '';
    this.successMsg = '';
  }

  fetchInvoice() {
    if (!this.customerRef && !this.contractNumber) { this.errorMsg = 'Saisissez une reference client ou numero de contrat'; return; }
    this.errorMsg = '';
    this.isLoading = true;
    this.billPaymentService.getInvoice(this.selectedBiller.key, this.customerRef, this.contractNumber).pipe(
      timeout(20000),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (inv) => {
        this.invoice = inv;
        this.fee = Math.round(inv.amount * 0.01 * 100) / 100;
      },
      error: (err) => {
        this.errorMsg = err?.name === 'TimeoutError'
          ? 'Le serveur ne répond pas. Réessayez.'
          : err?.error?.message || 'Aucune facture trouvee';
      }
    });
  }

  payInvoice() {
    if (!this.invoice) { this.errorMsg = 'Aucune facture a payer'; return; }
    this.isLoading = true;
    this.errorMsg = '';
    this.billPaymentService.payBill({ billerId: this.selectedBiller.key, customerRef: this.customerRef, contractNumber: this.contractNumber, amount: this.invoice.amount, fees: this.fee }).pipe(
      timeout(20000),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res) => {
        this.successMsg = `Paiement valide — Ref: ${res.transactionId}`;
        this.recentPayments.unshift({
          id: Date.now(),
          biller: this.selectedBiller.name,
          date: "Aujourd'hui",
          amount: this.invoice!.amount
        });
        this.invoice = null;
        this.selectedBiller = null;
      },
      error: (err) => {
        this.errorMsg = err?.name === 'TimeoutError'
          ? 'Le serveur ne répond pas. Réessayez.'
          : err?.error?.message || 'Erreur lors du paiement';
      }
    });
  }

  clearPayment() {
    this.selectedBiller = null; this.customerRef = ''; this.contractNumber = '';
    this.invoice = null; this.fee = 0; this.errorMsg = ''; this.successMsg = '';
  }
}
