import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../core/services/wallet.service';
import { TranslationService } from '../../core/services/translation.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-wallets-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wallets-root">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 10h20"/>
              <path d="M6 14h.01"/>
              <path d="M10 14h.01"/>
            </svg>
          </div>
          <div>
            <h2>Gestion des Wallets</h2>
            <p class="header-subtitle">Gerez les portefeuilles, limites et actions</p>
          </div>
        </div>
        <button class="btn-primary-gradient" (click)="openCreateWallet()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau Wallet
        </button>
      </header>

      <!-- Search & Filter Controls -->
      <section class="controls">
        <div class="search-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" [(ngModel)]="searchQuery" placeholder="Rechercher un wallet (numero, telephone, client...)" />
        </div>
        <div class="filter-wrapper">
          <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <select [(ngModel)]="statusFilter">
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="closed">Ferme</option>
          </select>
        </div>
        <div class="filter-wrapper">
          <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <select [(ngModel)]="typeFilter">
            <option value="all">Tous les types</option>
            <option value="Niveau 1">Niveau 1</option>
            <option value="Niveau 2">Niveau 2</option>
            <option value="Niveau 3">Niveau 3</option>
          </select>
        </div>
      </section>

      <!-- Alerts -->
      @if (successMessage) {
        <div class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ successMessage }}</span>
        </div>
      }
      @if (errorMessage) {
        <div class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      }

      <!-- Wallet List -->
      <section class="list">
        @for (wallet of filteredWallets(); track wallet.id) {
          <div class="wallet-card">
            <div class="card-left">
              <div class="avatar" [ngClass]="{
                'avatar-personal': wallet.type === 'Niveau 1',
                'avatar-merchant': wallet.type === 'Niveau 2',
                'avatar-agent': wallet.type === 'Niveau 3'
              }">
                <!-- Niveau 1 user icon -->
                @if (wallet.type === 'Niveau 1') {
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
                <!-- Niveau 2 store icon -->
                @if (wallet.type === 'Niveau 2') {
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                }
                <!-- Niveau 3 briefcase icon -->
                @if (wallet.type === 'Niveau 3') {
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                }
                @if (wallet.type !== 'Niveau 1' && wallet.type !== 'Niveau 2' && wallet.type !== 'Niveau 3') {
                  {{ wallet.ownerInitials }}
                }
              </div>
              <div class="meta">
                <div class="wallet-name">{{ wallet.ownerName }}</div>
                <div class="wallet-sub">
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M2 10h20"/>
                    </svg>
                    ID: {{ wallet.walletId }}
                  </span>
                  <span class="sub-divider"></span>
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {{ wallet.phone }}
                  </span>
                  <span class="sub-divider"></span>
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    {{ labelType(wallet.type) }}
                  </span>
                </div>
                <div class="badges">
                  <span class="badge" [ngClass]="{
                    'badge-success': wallet.status === 'active',
                    'badge-warning': wallet.status === 'suspended',
                    'badge-error': wallet.status === 'closed'
                  }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="6"/>
                    </svg>
                    {{ labelStatus(wallet.status) }}
                  </span>
                  <span class="badge" [ngClass]="{
                    'badge-info': wallet.kycVerified,
                    'badge-muted': !wallet.kycVerified
                  }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    KYC: {{ wallet.kycVerified ? 'Verifie' : 'Incomplet' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-middle">
              <div class="balance-block">
                <span class="balance-label">Solde</span>
                <span class="balance-amount">{{ wallet.balance }} {{ ts.currentCurrency }}</span>
                <span class="balance-limit">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  Limite: {{ wallet.dailyLimit }} {{ ts.currentCurrency }}
                </span>
              </div>
            </div>
            <div class="card-right">
              <button class="btn-action" (click)="viewDetails(wallet)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Details
              </button>
              <button class="btn-action" (click)="manageWallet(wallet)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Gerer
              </button>
              <button class="btn-action btn-action-accent" (click)="showWalletActions(wallet)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Actions
              </button>
            </div>
          </div>
        }
      </section>

      <!-- Create Wallet Modal -->
      @if (createWalletOpen) {
        <section class="modal-overlay" (click)="closeCreateWallet()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M2 10h20"/>
                    <line x1="12" y1="15" x2="12" y2="18"/>
                    <line x1="10.5" y1="16.5" x2="13.5" y2="16.5"/>
                  </svg>
                </div>
                <h3>Creer un nouveau wallet</h3>
              </div>
              <button class="modal-close" (click)="closeCreateWallet()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h4>Informations du proprietaire</h4>
                </div>
                <div class="form-grid form-grid-3">
                  <div class="form-field">
                    <label>Nom du proprietaire <span class="required">*</span></label>
                    <input [(ngModel)]="newWalletForm.ownerName" placeholder="Nom complet" />
                  </div>
                  <div class="form-field">
                    <label>N de telephone <span class="required">*</span></label>
                    <input [(ngModel)]="newWalletForm.phone" placeholder="+216 XX XXX XXX" />
                  </div>
                  <div class="form-field">
                    <label>Email</label>
                    <input [(ngModel)]="newWalletForm.email" placeholder="email&#64;exemple.com" />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/>
                  </svg>
                  <h4>Configuration du wallet</h4>
                </div>
                <div class="form-grid form-grid-3">
                  <div class="form-field">
                    <label>Type de wallet <span class="required">*</span></label>
                    <select [(ngModel)]="newWalletForm.type">
                      <option value="Niveau 1">Niveau 1</option>
                      <option value="Niveau 2">Niveau 2</option>
                      <option value="Niveau 3">Niveau 3</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Limite quotidienne ({{ ts.currentCurrency }}) <span class="required">*</span></label>
                    <input [(ngModel)]="newWalletForm.dailyLimit" type="number" placeholder="Ex: 5000" />
                  </div>
                  <div class="form-field">
                    <label>Limite mensuelle ({{ ts.currentCurrency }})</label>
                    <input [(ngModel)]="newWalletForm.monthlyLimit" type="number" placeholder="Ex: 50000" />
                  </div>
                  <div class="form-field">
                    <label>Devise <span class="required">*</span></label>
                    <select [(ngModel)]="newWalletForm.currency">
                      <option value="MAD">MAD</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Document d'identite</label>
                    <div class="file-drop-zone-sm" (click)="docInput.click()">
                      <input #docInput type="file" (change)="handleWalletDocument($event)" class="file-hidden" />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Choisir un fichier</span>
                    </div>
                  </div>
                  <div class="form-field">
                    <label>&nbsp;</label>
                    <label class="checkbox-wrapper">
                      <input type="checkbox" [(ngModel)]="newWalletForm.kycVerified" />
                      <span class="checkbox-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        KYC verifie
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeCreateWallet()">Annuler</button>
              <button class="btn-primary-gradient" (click)="createWallet()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Creer le wallet
              </button>
            </div>
          </div>
        </section>
      }

      <!-- Manage Wallet Modal -->
      @if (manageWalletOpen && selectedWallet) {
        <section class="modal-overlay" (click)="closeManageWallet()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/>
                  </svg>
                </div>
                <h3>Gerer le wallet - {{ selectedWallet.walletId }}</h3>
              </div>
              <button class="modal-close" (click)="closeManageWallet()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid form-grid-3">
                <div class="form-field">
                  <label>Limite quotidienne actuelle ({{ ts.currentCurrency }})</label>
                  <input [(ngModel)]="selectedWallet.dailyLimit" type="number" />
                </div>
                <div class="form-field">
                  <label>Limite mensuelle actuelle ({{ ts.currentCurrency }})</label>
                  <input [(ngModel)]="selectedWallet.monthlyLimit" type="number" />
                </div>
                <div class="form-field">
                  <label>Frais de transaction (%)</label>
                  <input [(ngModel)]="walletFee" type="number" placeholder="Ex: 1.5" />
                </div>
                <div class="form-field">
                  <label>Solde actuel ({{ ts.currentCurrency }})</label>
                  <input [(ngModel)]="selectedWallet.balance" type="number" disabled class="input-disabled" />
                </div>
                <div class="form-field form-field-span2">
                  <label>Notes internes</label>
                  <textarea [(ngModel)]="walletNotes" placeholder="Ajouter des notes sur ce wallet..."></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeManageWallet()">Fermer</button>
              <button class="btn-primary-gradient" (click)="updateWallet()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        </section>
      }

      <!-- Wallet Actions Modal -->
      @if (walletActionsOpen && selectedWallet) {
        <section class="modal-overlay" (click)="closeWalletActions()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-header-icon modal-header-icon-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3>Actions sur le wallet - {{ selectedWallet.walletId }}</h3>
              </div>
              <button class="modal-close" (click)="closeWalletActions()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid form-grid-2">
                <div class="form-field">
                  <label>Action a effectuer <span class="required">*</span></label>
                  <select [(ngModel)]="walletActionType">
                    <option value="">Selectionner une action</option>
                    <option value="suspend">Suspendre</option>
                    <option value="reactivate">Reactiver</option>
                    <option value="close">Cloturer</option>
                    <option value="credit">Crediter le wallet</option>
                    <option value="debit">Debiter le wallet</option>
                  </select>
                </div>
                @if (walletActionType === 'credit' || walletActionType === 'debit') {
                  <div class="form-field">
                    <label>Montant ({{ ts.currentCurrency }}) <span class="required">*</span></label>
                    <input [(ngModel)]="walletActionAmount" type="number" placeholder="0.00" />
                  </div>
                }
                <div class="form-field form-field-full">
                  <label>Motif / Raison <span class="required">*</span></label>
                  <textarea [(ngModel)]="walletActionReason" placeholder="Expliquez le motif de cette action..."></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeWalletActions()">Annuler</button>
              <button class="btn-primary-gradient" (click)="applyWalletAction()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Appliquer l'action
              </button>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    /* ===== HOST ===== */
    :host {
      display: block;
      padding: 28px 32px;
      background: var(--bg-primary, #F1F5F9);
      min-height: 100%;
    }

    /* ===== PAGE HEADER ===== */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg, 12px);
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .page-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
      letter-spacing: -0.025em;
    }

    .header-subtitle {
      margin: 2px 0 0 0;
      font-size: 14px;
      color: var(--text-secondary, #475569);
    }

    /* ===== BUTTONS ===== */
    .btn-primary-gradient {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-md, 8px);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: var(--transition-base, all 0.2s ease);
      box-shadow: 0 2px 8px rgba(200, 16, 46, 0.25);
      font-family: inherit;
    }

    .btn-primary-gradient:hover {
      box-shadow: 0 4px 16px rgba(200, 16, 46, 0.35);
      transform: translateY(-1px);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-card, #FFFFFF);
      color: var(--text-primary, #0F172A);
      border: 1px solid var(--border-light, #E2E8F0);
      padding: 10px 20px;
      border-radius: var(--radius-md, 8px);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: var(--transition-base, all 0.2s ease);
      font-family: inherit;
    }

    .btn-secondary:hover {
      background: var(--bg-input, #F8FAFC);
      border-color: var(--text-muted, #94A3B8);
    }

    /* ===== SEARCH & FILTER CONTROLS ===== */
    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .search-wrapper {
      flex: 1;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted, #94A3B8);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 11px 14px 11px 42px;
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-card, #FFFFFF);
      font-size: 14px;
      color: var(--text-primary, #0F172A);
      transition: var(--transition-fast, all 0.15s ease);
      font-family: inherit;
      box-sizing: border-box;
    }

    .search-input::placeholder {
      color: var(--text-muted, #94A3B8);
    }

    .search-input:focus {
      outline: none;
      border-color: #E8471B;
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
    }

    .filter-wrapper {
      position: relative;
    }

    .filter-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted, #94A3B8);
      pointer-events: none;
      z-index: 1;
    }

    .filter-wrapper select {
      padding: 11px 16px 11px 36px;
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-card, #FFFFFF);
      font-size: 14px;
      color: var(--text-primary, #0F172A);
      cursor: pointer;
      font-family: inherit;
      appearance: none;
      -webkit-appearance: none;
      min-width: 170px;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .filter-wrapper select:focus {
      outline: none;
      border-color: #E8471B;
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
    }

    /* ===== ALERTS ===== */
    .alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-md, 8px);
      font-size: 14px;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .alert-error {
      background: var(--error-bg, #FEF2F2);
      color: var(--error, #DC2626);
      border: 1px solid rgba(220, 38, 38, 0.15);
    }

    .alert-success {
      background: var(--success-bg, #ECFDF5);
      color: var(--success, #059669);
      border: 1px solid rgba(5, 150, 105, 0.15);
    }

    /* ===== WALLET LIST ===== */
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .wallet-card {
      display: flex;
      align-items: center;
      background: var(--bg-card, #FFFFFF);
      padding: 18px 20px;
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.08));
      transition: var(--transition-base, all 0.2s ease);
      border: 1px solid var(--border-light, #E2E8F0);
    }

    .wallet-card:hover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1));
      border-color: rgba(232, 71, 27, 0.15);
    }

    .card-left {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex: 1;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg, 12px);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .avatar-personal {
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
    }

    .avatar-merchant {
      background: linear-gradient(135deg, #E8471B, #F7941D);
    }

    .avatar-agent {
      background: linear-gradient(135deg, var(--success, #059669), #34d399);
    }

    .meta {
      flex: 1;
    }

    .wallet-name {
      font-weight: 700;
      font-size: 15px;
      color: var(--text-primary, #0F172A);
    }

    .wallet-sub {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .sub-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text-secondary, #475569);
    }

    .sub-item svg {
      color: var(--text-muted, #94A3B8);
    }

    .sub-divider {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--text-muted, #94A3B8);
    }

    .badges {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: var(--radius-full, 50px);
      font-size: 12px;
      font-weight: 600;
    }

    .badge-success {
      background: var(--success-bg, #ECFDF5);
      color: var(--success, #059669);
    }

    .badge-warning {
      background: var(--warning-bg, #FFFBEB);
      color: var(--warning, #D97706);
    }

    .badge-error {
      background: var(--error-bg, #FEF2F2);
      color: var(--error, #DC2626);
    }

    .badge-info {
      background: var(--info-bg, #EFF6FF);
      color: var(--info, #2563EB);
    }

    .badge-muted {
      background: var(--bg-input, #F8FAFC);
      color: var(--text-muted, #94A3B8);
    }

    .card-middle {
      flex: 0 0 160px;
      text-align: right;
      margin: 0 24px;
    }

    .balance-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .balance-label {
      font-size: 12px;
      color: var(--text-muted, #94A3B8);
      margin-bottom: 2px;
    }

    .balance-amount {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
    }

    .balance-limit {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--text-muted, #94A3B8);
      margin-top: 4px;
    }

    .card-right {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: var(--radius-md, 8px);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition-fast, all 0.15s ease);
      font-family: inherit;
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-card, #FFFFFF);
      color: var(--text-secondary, #475569);
    }

    .btn-action:hover {
      border-color: var(--text-muted, #94A3B8);
      background: var(--bg-input, #F8FAFC);
      color: var(--text-primary, #0F172A);
    }

    .btn-action-accent {
      background: rgba(232, 71, 27, 0.06);
      border-color: rgba(232, 71, 27, 0.2);
      color: #E8471B;
    }

    .btn-action-accent:hover {
      background: rgba(232, 71, 27, 0.12);
      border-color: rgba(232, 71, 27, 0.4);
      color: #C8102E;
    }

    /* ===== MODAL OVERLAY ===== */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 1000;
      padding: 40px 20px;
      overflow-y: auto;
      animation: overlayIn 0.2s ease;
    }

    @keyframes overlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes panelIn {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-panel {
      background: var(--bg-card, #FFFFFF);
      border-radius: var(--radius-xl, 16px);
      box-shadow: var(--shadow-xl, 0 20px 60px rgba(0,0,0,0.15));
      max-width: 780px;
      width: 100%;
      animation: panelIn 0.25s ease;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-input, #F8FAFC);
    }

    .modal-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .modal-header-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md, 8px);
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-header-icon-accent {
      background: linear-gradient(135deg, var(--hps-orange, #E8471B), var(--hps-amber, #F7941D));
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
    }

    .modal-close {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-card, #FFFFFF);
      color: var(--text-muted, #94A3B8);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .modal-close:hover {
      color: var(--error, #DC2626);
      border-color: rgba(220, 38, 38, 0.3);
      background: var(--error-bg, #FEF2F2);
    }

    .modal-body {
      padding: 24px;
      max-height: 65vh;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-input, #F8FAFC);
    }

    /* ===== FORM SECTIONS ===== */
    .form-section {
      margin-bottom: 28px;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-light, #E2E8F0);
    }

    .section-header svg {
      color: #E8471B;
      flex-shrink: 0;
    }

    .section-header h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
    }

    .form-grid {
      display: grid;
      gap: 16px;
    }

    .form-grid-2 {
      grid-template-columns: 1fr 1fr;
    }

    .form-grid-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-field-full {
      grid-column: 1 / -1;
    }

    .form-field-span2 {
      grid-column: span 2;
    }

    .form-field label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary, #475569);
    }

    .required {
      color: var(--hps-red, #C8102E);
    }

    .form-field input,
    .form-field select,
    .form-field textarea {
      padding: 10px 14px;
      border-radius: var(--radius-md, 8px);
      border: 1px solid var(--border-light, #E2E8F0);
      background: var(--bg-input, #F8FAFC);
      font-size: 14px;
      color: var(--text-primary, #0F172A);
      font-family: inherit;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus {
      outline: none;
      border-color: #E8471B;
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
      background: var(--bg-card, #FFFFFF);
    }

    .form-field input::placeholder,
    .form-field textarea::placeholder {
      color: var(--text-muted, #94A3B8);
    }

    .form-field textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-field select {
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    .input-disabled {
      background: var(--bg-primary, #F1F5F9) !important;
      color: var(--text-muted, #94A3B8) !important;
      cursor: not-allowed;
    }

    /* ===== FILE UPLOAD (SMALL) ===== */
    .file-hidden {
      display: none;
    }

    .file-drop-zone-sm {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 2px dashed var(--border-light, #E2E8F0);
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      transition: var(--transition-base, all 0.2s ease);
      background: var(--bg-card, #FFFFFF);
      font-size: 13px;
      color: var(--text-secondary, #475569);
    }

    .file-drop-zone-sm:hover {
      border-color: rgba(232, 71, 27, 0.4);
      background: rgba(247, 148, 29, 0.03);
      color: #E8471B;
    }

    .file-drop-zone-sm svg {
      color: var(--text-muted, #94A3B8);
      flex-shrink: 0;
    }

    .file-drop-zone-sm:hover svg {
      color: #E8471B;
    }

    /* ===== CHECKBOX ===== */
    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 10px 0;
    }

    .checkbox-wrapper input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #E8471B;
      cursor: pointer;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-primary, #0F172A);
      font-weight: 500;
    }

    .checkbox-label svg {
      color: var(--text-muted, #94A3B8);
    }
  `]
})
export class WalletsManagementComponent implements OnInit {
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'suspended' | 'closed' = 'all';
  typeFilter: 'all' | 'Niveau 1' | 'Niveau 2' | 'Niveau 3' = 'all';

  createWalletOpen = false;
  manageWalletOpen = false;
  walletActionsOpen = false;
  selectedWallet: any = null;
  wallets: any[] = [];

  newWalletForm: any = { ownerName:'', phone:'', email:'', type:'Niveau 1', dailyLimit:5000, monthlyLimit:50000, currency:'MAD', kycVerified:false };
  walletFee = 0;
  walletNotes = '';
  walletActionType = '';
  walletActionAmount = 0;
  walletActionReason = '';
  successMessage = '';
  errorMessage = '';

  constructor(private walletService: WalletService, public ts: TranslationService) {}

  ngOnInit() { this.loadWallets(); }

  loadWallets() {
    this.walletService.getWallets({ search: this.searchQuery || undefined, status: this.statusFilter !== 'all' ? this.statusFilter : undefined, type: this.typeFilter !== 'all' ? this.typeFilter : undefined }).subscribe({
      next: (data) => (this.wallets = data),
      error: () => (this.errorMessage = 'Erreur lors du chargement des wallets')
    });
  }

  filteredWallets() {
    const q = this.searchQuery.trim().toLowerCase();
    return this.wallets.filter(w => {
      if (this.statusFilter !== 'all' && w.status !== this.statusFilter) return false;
      if (this.typeFilter !== 'all' && w.type !== this.typeFilter) return false;
      if (!q) return true;
      return (w.ownerName||'').toLowerCase().includes(q) || (w.walletId||'').includes(q) || (w.phone||'').includes(q);
    });
  }

  labelStatus(s: string) { return ({ active:'Actif', suspended:'Suspendu', closed:'Ferme' } as any)[s] || s; }
  labelType(t: string) { return t; }

  openCreateWallet() { this.createWalletOpen = true; this.errorMessage = ''; this.successMessage = ''; }
  closeCreateWallet() {
    this.createWalletOpen = false;
    this.newWalletForm = { ownerName:'', phone:'', email:'', type:'personal', dailyLimit:5000, monthlyLimit:50000, currency:'MAD', kycVerified:false };
  }

  createWallet() {
    if (!this.newWalletForm.ownerName || !this.newWalletForm.phone || !this.newWalletForm.dailyLimit) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires'; return;
    }
    this.walletService.createWallet(this.newWalletForm).pipe(
      timeout(20000),
      finalize(() => {})
    ).subscribe({
      next: (w) => { this.wallets.unshift(w); this.successMessage = `Wallet cree: ${w.walletId}`; this.errorMessage = ''; this.closeCreateWallet(); },
      error: (err) => (this.errorMessage = err?.name === 'TimeoutError' ? 'Le serveur ne répond pas. Réessayez.' : err?.error?.message || 'Erreur lors de la creation du wallet')
    });
  }

  handleWalletDocument(_e: any) {}

  manageWallet(wallet: any) { this.selectedWallet = { ...wallet }; this.manageWalletOpen = true; this.walletFee = wallet.transactionFee || 0; this.walletNotes = wallet.notes || ''; }
  closeManageWallet() { this.manageWalletOpen = false; this.selectedWallet = null; }

  updateWallet() {
    this.walletService.updateWallet(this.selectedWallet.id, { dailyLimit: this.selectedWallet.dailyLimit, monthlyLimit: this.selectedWallet.monthlyLimit, transactionFee: this.walletFee, notes: this.walletNotes }).pipe(
      timeout(20000),
      finalize(() => {})
    ).subscribe({
      next: () => { this.successMessage = `Wallet ${this.selectedWallet.walletId} mis a jour`; this.errorMessage = ''; this.closeManageWallet(); this.loadWallets(); },
      error: (err) => (this.errorMessage = err?.name === 'TimeoutError' ? 'Le serveur ne répond pas. Réessayez.' : err?.error?.message || 'Erreur lors de la mise a jour')
    });
  }

  showWalletActions(wallet: any) { this.selectedWallet = wallet; this.walletActionsOpen = true; this.walletActionType = ''; this.walletActionAmount = 0; this.walletActionReason = ''; }
  closeWalletActions() { this.walletActionsOpen = false; this.selectedWallet = null; }

  applyWalletAction() {
    if (!this.walletActionType || !this.walletActionReason) { this.errorMessage = 'Veuillez selectionner une action et indiquer le motif'; return; }
    if ((this.walletActionType === 'credit' || this.walletActionType === 'debit') && this.walletActionAmount <= 0) { this.errorMessage = 'Montant invalide'; return; }
    this.walletService.applyAction(this.selectedWallet.id, { action: this.walletActionType as any, amount: this.walletActionAmount, reason: this.walletActionReason }).pipe(
      timeout(20000),
      finalize(() => {})
    ).subscribe({
      next: (res) => { this.successMessage = res.message || `Action appliquee au wallet ${this.selectedWallet.walletId}`; this.errorMessage = ''; this.closeWalletActions(); this.loadWallets(); },
      error: (err) => (this.errorMessage = err?.name === 'TimeoutError' ? 'Le serveur ne répond pas. Réessayez.' : err?.error?.message || 'Erreur lors de l\'action')
    });
  }

  viewDetails(wallet: any) {
    this.successMessage = `Wallet: ${wallet.walletId} — Proprietaire: ${wallet.ownerName} — Solde: ${wallet.balance} ${this.ts.currentCurrency} — Type: ${this.labelType(wallet.type)}`;
    this.errorMessage = '';
  }
}
