import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillPaymentService } from '../../core/services/bill-payment.service';
import { TranslationService } from '../../core/services/translation.service';
import { Invoice } from '../../core/models';

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
              <div class="biller-icon" [ngSwitch]="b.key">
                <!-- ONEE - Electricity & Water -->
                <svg *ngSwitchCase="'onee'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FFF7ED"/>
                  <path d="M24 12L18 28H30L24 36" stroke="#F7941D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <!-- LYDEC - Water & Electricity Casablanca -->
                <svg *ngSwitchCase="'lydec'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#EFF6FF"/>
                  <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#2563EB"/>
                </svg>
                <!-- Redal - Water & Sanitation Rabat -->
                <svg *ngSwitchCase="'redal'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#ECFDF5"/>
                  <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#059669"/>
                </svg>
                <!-- Maroc Telecom -->
                <svg *ngSwitchCase="'maroc-telecom'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#F0F9FF"/>
                  <path d="M14 30V26M19 30V22M24 30V18M29 30V22M34 30V26" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <!-- Orange Maroc -->
                <svg *ngSwitchCase="'orange'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FFF7ED"/>
                  <circle cx="24" cy="24" r="10" fill="#E8471B"/>
                </svg>
                <!-- Inwi -->
                <svg *ngSwitchCase="'inwi'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FAF5FF"/>
                  <path d="M16 32C18 24 20 20 24 20C28 20 30 24 32 32" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="24" cy="15" r="2.5" fill="#7C3AED"/>
                </svg>
                <!-- Canal+ -->
                <svg *ngSwitchCase="'canalplus'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#F5F3FF"/>
                  <rect x="14" y="16" width="20" height="14" rx="3" stroke="#6D28D9" stroke-width="2"/>
                  <path d="M14 34H34" stroke="#6D28D9" stroke-width="2" stroke-linecap="round"/>
                  <path d="M20 38H28" stroke="#6D28D9" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <!-- Wafa Assurance -->
                <svg *ngSwitchCase="'wafa'" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#ECFDF5"/>
                  <path d="M24 12L30 16V24C30 30 24 34 24 34C24 34 18 30 18 24V16L24 12Z" fill="#059669"/>
                </svg>
                <div *ngSwitchDefault class="fallback-icon">{{ b.icon }}</div>
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
          <div class="payment-card">
            <!-- Biller Header -->
            <div class="payment-header">
              <div class="payment-header-icon" [ngSwitch]="selectedBiller?.key">
                <svg *ngSwitchCase="'onee'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FFF7ED"/>
                  <path d="M24 12L18 28H30L24 36" stroke="#F7941D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg *ngSwitchCase="'lydec'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#EFF6FF"/>
                  <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#2563EB"/>
                </svg>
                <svg *ngSwitchCase="'redal'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#ECFDF5"/>
                  <path d="M24 10C20 18 16 20 16 24C16 30 22 34 24 36C26 34 32 30 32 24C32 20 28 18 24 10Z" fill="#059669"/>
                </svg>
                <svg *ngSwitchCase="'maroc-telecom'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#F0F9FF"/>
                  <path d="M14 30V26M19 30V22M24 30V18M29 30V22M34 30V26" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg *ngSwitchCase="'orange'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FFF7ED"/>
                  <circle cx="24" cy="24" r="10" fill="#E8471B"/>
                </svg>
                <svg *ngSwitchCase="'inwi'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FAF5FF"/>
                  <path d="M16 32C18 24 20 20 24 20C28 20 30 24 32 32" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="24" cy="15" r="2.5" fill="#7C3AED"/>
                </svg>
                <svg *ngSwitchCase="'canalplus'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#F5F3FF"/>
                  <rect x="14" y="16" width="20" height="14" rx="3" stroke="#6D28D9" stroke-width="2"/>
                  <path d="M14 34H34" stroke="#6D28D9" stroke-width="2" stroke-linecap="round"/>
                  <path d="M20 38H28" stroke="#6D28D9" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg *ngSwitchCase="'wafa'" width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#ECFDF5"/>
                  <path d="M24 12L30 16V24C30 30 24 34 24 34C24 34 18 30 18 24V16L24 12Z" fill="#059669"/>
                </svg>
              </div>
              <div class="payment-header-text">
                <h3>{{ selectedBiller.name }}</h3>
                <span class="payment-header-desc">{{ selectedBiller.desc }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Form Fields -->
            <div class="form-body">
              <div class="form-row">
                <div class="form-field">
                  <label class="field-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    N. de telephone client
                    <span class="required">*</span>
                  </label>
                  <input class="field-input" [(ngModel)]="customerRef" placeholder="+212 6XX XXX XXX" />
                </div>
                <div class="form-field">
                  <label class="field-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Numero de contrat / compteur
                    <span class="required">*</span>
                  </label>
                  <input class="field-input" [(ngModel)]="contractNumber" placeholder="Ex: 123456789" />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button class="btn-primary" (click)="fetchInvoice()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Consulter la facture
                </button>
                <button class="btn-outlined" (click)="clearPayment()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Effacer
                </button>
              </div>

              <!-- Error Alert -->
              @if (errorMsg) {
                <div class="alert alert-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="var(--error)" stroke-width="2"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="var(--error)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ errorMsg }}</span>
                </div>
              }

              <!-- Success Alert -->
              @if (successMsg) {
                <div class="alert alert-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="var(--success)" stroke-width="2"/>
                    <path d="M9 12l2 2 4-4" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ successMsg }}</span>
                </div>
              }

              <!-- Invoice Result -->
              @if (invoice) {
                <div class="invoice-result">
                  <div class="invoice-header">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="9" y="3" width="6" height="4" rx="1" stroke="var(--hps-orange)" stroke-width="2"/>
                    </svg>
                    <h4>Facture trouvee</h4>
                  </div>
                  <div class="invoice-details">
                    <div class="invoice-row">
                      <div class="invoice-item">
                        <span class="invoice-label">Reference</span>
                        <span class="invoice-value">{{ invoice.invoiceId }}</span>
                      </div>
                      <div class="invoice-item">
                        <span class="invoice-label">Periode</span>
                        <span class="invoice-value">{{ invoice.period }}</span>
                      </div>
                      <div class="invoice-item">
                        <span class="invoice-label">Montant du</span>
                        <span class="invoice-value invoice-amount">{{ invoice.amount }} {{ ts.currentCurrency }}</span>
                      </div>
                      <div class="invoice-item">
                        <span class="invoice-label">Echeance</span>
                        <span class="invoice-value">{{ invoice.dueDate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="invoice-action">
                    <button class="btn-pay" [disabled]="isLoading" (click)="payInvoice()">
                      @if (isLoading) {
                        <span class="spinner"></span>
                        Traitement...
                      } @else {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="4" width="22" height="16" rx="3" stroke="currentColor" stroke-width="2"/>
                          <path d="M1 10h22" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Payer la facture
                      }
                    </button>
                  </div>
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

    /* ---- Responsive ---- */
    @media (max-width: 1000px) {
      .biller-grid { grid-template-columns: repeat(2, 1fr); }
      .form-row { grid-template-columns: 1fr; }
      .invoice-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      :host { padding: 16px; }
      .biller-grid { grid-template-columns: 1fr; }
      .invoice-row { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
    }
    `
  ]
})
export class BillPaymentsComponent {
  billers = [
    { key: 'onee', name: 'ONEE', desc: "Electricite & Eau", icon: '⚡' },
    { key: 'lydec', name: 'LYDEC', desc: 'Eau & Electricite (Casablanca)', icon: '💧' },
    { key: 'redal', name: 'Redal', desc: 'Eau & Assainissement (Rabat)', icon: '💧' },
    { key: 'maroc-telecom', name: 'Maroc Telecom', desc: 'Telecommunications', icon: '📶' },
    { key: 'orange', name: 'Orange Maroc', desc: 'Telephonie mobile', icon: '🟠' },
    { key: 'inwi', name: 'Inwi', desc: 'Telecommunications', icon: '📡' },
    { key: 'canalplus', name: 'Canal+', desc: 'Television', icon: '📺' },
    { key: 'wafa', name: 'Wafa Assurance', desc: "Assurances", icon: '🛡️' }
  ];

  selectedBiller: any = null;
  customerRef = '';
  contractNumber = '';
  invoice: Invoice | null = null;
  fee = 0;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

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
    this.billPaymentService.getInvoice(this.selectedBiller.key, this.customerRef, this.contractNumber).subscribe({
      next: (inv) => {
        this.isLoading = false;
        this.invoice = inv;
        this.fee = Math.round(inv.amount * 0.01 * 100) / 100;
      },
      error: (err) => { this.isLoading = false; this.errorMsg = err?.error?.message || 'Aucune facture trouvee'; }
    });
  }

  payInvoice() {
    if (!this.invoice) { this.errorMsg = 'Aucune facture a payer'; return; }
    this.isLoading = true;
    this.errorMsg = '';
    this.billPaymentService.payBill({ billerId: this.selectedBiller.key, customerRef: this.customerRef, contractNumber: this.contractNumber, amount: this.invoice.amount, fees: this.fee }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = `Paiement valide — Ref: ${res.transactionId}`;
        this.invoice = null;
        this.selectedBiller = null;
      },
      error: (err) => { this.isLoading = false; this.errorMsg = err?.error?.message || 'Erreur lors du paiement'; }
    });
  }

  clearPayment() {
    this.selectedBiller = null; this.customerRef = ''; this.contractNumber = '';
    this.invoice = null; this.fee = 0; this.errorMsg = ''; this.successMsg = '';
  }
}
