import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  standalone: true,
  selector: 'app-clients-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clients-root">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h2>Gestion des Clients</h2>
            <p class="header-subtitle">Consultez, enrolez et gerez vos clients</p>
          </div>
        </div>
        <button class="btn-primary-gradient" (click)="openEnroll()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau Client
        </button>
      </header>

      <!-- Search & Filter Controls -->
      <section class="controls">
        <div class="search-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" [(ngModel)]="q" placeholder="Rechercher un client (nom, CIN, telephone...)" />
        </div>
        <div class="filter-wrapper">
          <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <select [(ngModel)]="statusFilter">
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="kyc_incomplete">KYC Incomplet</option>
          </select>
        </div>
      </section>

      <!-- Alerts -->
      @if (errorMsg) {
        <div class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{{ errorMsg }}</span>
        </div>
      }
      @if (successMsg) {
        <div class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ successMsg }}</span>
        </div>
      }

      <!-- Client List -->
      <section class="list">
        @for (c of filteredClients(); track c.id) {
          <div class="client-card">
            <div class="card-left">
              <div class="avatar">{{ initials(c.name) }}</div>
              <div class="meta">
                <div class="client-name">{{ c.name }}</div>
                <div class="client-sub">
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M2 8h20"/>
                    </svg>
                    CIN: {{ c.cin }}
                  </span>
                  <span class="sub-divider"></span>
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {{ c.phone }}
                  </span>
                  <span class="sub-divider"></span>
                  <span class="sub-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="2"/>
                      <path d="M12 8v8"/>
                      <path d="M8 12h8"/>
                    </svg>
                    Wallet: {{ c.walletId }}
                  </span>
                </div>
                <div class="badges">
                  <span class="badge" [ngClass]="{
                    'badge-success': c.status === 'active',
                    'badge-warning': c.status === 'suspended',
                    'badge-muted': c.status !== 'active' && c.status !== 'suspended'
                  }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="6"/>
                    </svg>
                    {{ labelStatus(c.status) }}
                  </span>
                  <span class="badge" [ngClass]="{
                    'badge-info': c.kyc === 'verified',
                    'badge-muted': c.kyc !== 'verified'
                  }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    KYC: {{ c.kycLabel }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-right">
              <div class="balance-block">
                <span class="balance-label">Solde</span>
                <strong class="balance-amount">{{ c.balance }}</strong>
              </div>
              <div class="action-buttons">
                <button class="btn-action btn-action-edit" (click)="editClient(c)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Modifier
                </button>
                <button class="btn-action btn-action-view" (click)="viewDetails(c)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>
        }
      </section>

      <!-- Enrollment Form -->
      @if (enrollOpen) {
        <section class="modal-overlay" (click)="closeEnroll()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <h3>Enroler un client</h3>
              </div>
              <button class="modal-close" (click)="closeEnroll()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <!-- Personal Information Section -->
              <div class="form-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h4>Informations personnelles</h4>
                </div>
                <div class="form-grid form-grid-3">
                  <div class="form-field">
                    <label>Nom <span class="required">*</span></label>
                    <input [(ngModel)]="form.name" placeholder="Nom de famille" />
                  </div>
                  <div class="form-field">
                    <label>Prenom <span class="required">*</span></label>
                    <input [(ngModel)]="form.firstName" placeholder="Prenom" />
                  </div>
                  <div class="form-field">
                    <label>Date de naissance <span class="required">*</span></label>
                    <input [(ngModel)]="form.dob" placeholder="jj/mm/aaaa" />
                  </div>
                  <div class="form-field">
                    <label>Lieu de naissance</label>
                    <input [(ngModel)]="form.birthPlace" placeholder="Ville" />
                  </div>
                  <div class="form-field">
                    <label>Nationalite <span class="required">*</span></label>
                    <select [(ngModel)]="form.nationality">
                      <option value="TN">Tunisia</option>
                      <option value="MA">Morocco</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Sexe <span class="required">*</span></label>
                    <select [(ngModel)]="form.gender">
                      <option value="M">Homme</option>
                      <option value="F">Femme</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>CIN / Identifiant <span class="required">*</span></label>
                    <input [(ngModel)]="form.cin" placeholder="Numero CIN" />
                  </div>
                  <div class="form-field">
                    <label>Telephone <span class="required">*</span></label>
                    <input [(ngModel)]="form.phone" placeholder="+216 XX XXX XXX" />
                  </div>
                  <div class="form-field">
                    <label>Email</label>
                    <input [(ngModel)]="form.email" placeholder="ex&#64;domaine.tld" />
                  </div>
                </div>
              </div>

              <!-- Contact Section -->
              <div class="form-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h4>Coordonnees</h4>
                </div>
                <div class="form-grid form-grid-2">
                  <div class="form-field">
                    <label>N de telephone <span class="required">*</span></label>
                    <input [(ngModel)]="form.phone" placeholder="+216 XX XXX XXX" />
                  </div>
                  <div class="form-field">
                    <label>Email</label>
                    <input [(ngModel)]="form.email" type="email" placeholder="email&#64;example.com" />
                  </div>
                  <div class="form-field form-field-full">
                    <label>Adresse complete <span class="required">*</span></label>
                    <textarea [(ngModel)]="form.address" placeholder="Rue, code postal, ville"></textarea>
                  </div>
                  <div class="form-field">
                    <label>Ville <span class="required">*</span></label>
                    <input [(ngModel)]="form.city" placeholder="Ville de residence" />
                  </div>
                </div>
              </div>

              <!-- KYC Documents Section -->
              <div class="form-section form-section-highlight">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <h4>Documents KYC</h4>
                </div>
                <div class="form-grid form-grid-4">
                  <div class="form-field">
                    <label>Type de piece d'identite <span class="required">*</span></label>
                    <select [(ngModel)]="form.idType">
                      <option value="">Selectionner</option>
                      <option value="cin">CIN</option>
                      <option value="passport">Passport</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Numero de la piece <span class="required">*</span></label>
                    <input [(ngModel)]="form.idNumber" placeholder="Ex: 12345678" />
                  </div>
                  <div class="form-field">
                    <label>Date d'emission <span class="required">*</span></label>
                    <input [(ngModel)]="form.idIssueDate" type="date" />
                  </div>
                  <div class="form-field">
                    <label>Date d'expiration <span class="required">*</span></label>
                    <input [(ngModel)]="form.idExpiryDate" type="date" />
                  </div>
                </div>

                <!-- Document Uploads -->
                <div class="upload-grid">
                  <div class="upload-box">
                    <label class="upload-label">Telecharger piece d'identite (Recto)</label>
                    <div class="file-drop-zone" (click)="rectoInput.click()">
                      <input #rectoInput type="file" (change)="handleRecto($event)" id="recto" class="file-hidden" />
                      <div class="drop-content">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="18" x2="12" y2="12"/>
                          <line x1="9" y1="15" x2="12" y2="12"/>
                          <line x1="15" y1="15" x2="12" y2="12"/>
                        </svg>
                        <p>Cliquez pour telecharger ou glissez-deposez</p>
                        <span class="drop-hint">PNG, JPG, PDF (max 5MB)</span>
                      </div>
                    </div>
                    @if (formFiles.recto) {
                      <div class="file-attached">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {{ formFiles.recto }}
                      </div>
                    }
                  </div>
                  <div class="upload-box">
                    <label class="upload-label">Telecharger piece d'identite (Verso)</label>
                    <div class="file-drop-zone" (click)="versoInput.click()">
                      <input #versoInput type="file" (change)="handleVerso($event)" id="verso" class="file-hidden" />
                      <div class="drop-content">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="18" x2="12" y2="12"/>
                          <line x1="9" y1="15" x2="12" y2="12"/>
                          <line x1="15" y1="15" x2="12" y2="12"/>
                        </svg>
                        <p>Cliquez pour telecharger ou glissez-deposez</p>
                        <span class="drop-hint">PNG, JPG, PDF (max 5MB)</span>
                      </div>
                    </div>
                    @if (formFiles.verso) {
                      <div class="file-attached">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {{ formFiles.verso }}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeEnroll()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Reinitialiser
              </button>
              <button class="btn-primary-gradient" (click)="enroll()" [disabled]="isLoading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ isLoading ? 'Enrolement en cours...' : 'Enroler le client et creer le wallet' }}
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

    .btn-primary-gradient:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
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
      min-width: 180px;
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

    /* ===== CLIENT LIST ===== */
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .client-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card, #FFFFFF);
      padding: 18px 20px;
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.08));
      transition: var(--transition-base, all 0.2s ease);
      border: 1px solid var(--border-light, #E2E8F0);
    }

    .client-card:hover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1));
      border-color: rgba(232, 71, 27, 0.15);
    }

    .card-left {
      display: flex;
      gap: 16px;
      align-items: center;
      flex: 1;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-full, 50%);
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .client-name {
      font-weight: 700;
      font-size: 15px;
      color: var(--text-primary, #0F172A);
    }

    .client-sub {
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

    .badge-info {
      background: var(--info-bg, #EFF6FF);
      color: var(--info, #2563EB);
    }

    .badge-muted {
      background: var(--bg-input, #F8FAFC);
      color: var(--text-muted, #94A3B8);
    }

    .card-right {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-shrink: 0;
    }

    .balance-block {
      text-align: right;
    }

    .balance-label {
      display: block;
      font-size: 12px;
      color: var(--text-muted, #94A3B8);
      margin-bottom: 2px;
    }

    .balance-amount {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
    }

    .action-buttons {
      display: flex;
      gap: 8px;
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

    .btn-action-view:hover {
      border-color: rgba(232, 71, 27, 0.3);
      color: #E8471B;
      background: rgba(232, 71, 27, 0.04);
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
      max-width: 820px;
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

    .form-section-highlight {
      background: rgba(247, 148, 29, 0.04);
      border: 1px solid rgba(247, 148, 29, 0.15);
      border-radius: var(--radius-lg, 12px);
      padding: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-light, #E2E8F0);
    }

    .form-section-highlight .section-header {
      border-bottom-color: rgba(247, 148, 29, 0.15);
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

    .form-grid-4 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-field-full {
      grid-column: 1 / -1;
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

    /* ===== FILE UPLOAD ===== */
    .upload-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .upload-box {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .upload-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary, #0F172A) !important;
    }

    .file-hidden {
      display: none;
    }

    .file-drop-zone {
      cursor: pointer;
      border: 2px dashed var(--border-light, #E2E8F0);
      border-radius: var(--radius-md, 8px);
      padding: 28px 20px;
      text-align: center;
      transition: var(--transition-base, all 0.2s ease);
      background: var(--bg-card, #FFFFFF);
    }

    .file-drop-zone:hover {
      border-color: rgba(232, 71, 27, 0.4);
      background: rgba(247, 148, 29, 0.03);
    }

    .drop-content svg {
      color: var(--text-muted, #94A3B8);
      margin-bottom: 8px;
    }

    .file-drop-zone:hover .drop-content svg {
      color: #E8471B;
    }

    .drop-content p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary, #475569);
    }

    .drop-hint {
      display: block;
      margin-top: 4px;
      font-size: 11px;
      color: var(--text-muted, #94A3B8);
    }

    .file-attached {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--success, #059669);
      font-weight: 500;
      padding: 4px 0;
    }
  `]
})
export class ClientsManagementComponent implements OnInit {
  q = '';
  statusFilter: 'all' | 'active' | 'suspended' | 'kyc_incomplete' = 'all';
  enrollOpen = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  clients: any[] = [];

  form: any = {
    name:'', firstName:'', dob:'', birthPlace:'', nationality:'TN', gender:'M',
    cin:'', phone:'', email:'', address:'', city:'',
    idType:'', idNumber:'', idIssueDate:'', idExpiryDate:''
  };
  formFiles: any = { recto: null, verso: null };

  constructor(private clientService: ClientService, public ts: TranslationService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients({ search: this.q || undefined, status: this.statusFilter !== 'all' ? this.statusFilter : undefined }).subscribe({
      next: (data) => (this.clients = data),
      error: () => (this.errorMsg = 'Erreur lors du chargement des clients')
    });
  }

  filteredClients() {
    const q = this.q.trim().toLowerCase();
    return this.clients.filter(c => {
      if (this.statusFilter !== 'all') {
        if (this.statusFilter === 'kyc_incomplete' && c.kyc === 'verified') return false;
        if (this.statusFilter === 'active' && c.status !== 'active') return false;
        if (this.statusFilter === 'suspended' && c.status !== 'suspended') return false;
      }
      if (!q) return true;
      return (c.name || '').toLowerCase().includes(q) || (c.cin || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
    });
  }

  initials(name: string) { return (name || '').split(' ').map((s:string)=>s[0]).slice(0,2).join('').toUpperCase(); }
  labelStatus(s:string) { return s === 'active' ? 'Actif' : (s === 'suspended' ? 'Suspendu' : s); }

  openEnroll() { this.enrollOpen = true; this.errorMsg = ''; this.successMsg = ''; }
  closeEnroll() { this.enrollOpen = false; }

  enroll() {
    if (!this.form.name || !this.form.firstName || !this.form.cin || !this.form.phone || !this.form.address || !this.form.city) {
      this.errorMsg = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.clientService.enrollClient({
      lastName: this.form.name,
      firstName: this.form.firstName,
      cin: this.form.cin,
      phone: this.form.phone,
      email: this.form.email,
      nationality: this.form.nationality,
      birthDate: this.form.dob,
      birthPlace: this.form.birthPlace,
      gender: this.form.gender,
      address: this.form.address,
      city: this.form.city,
      idType: this.form.idType,
      idNumber: this.form.idNumber,
      idIssueDate: this.form.idIssueDate,
      idExpiryDate: this.form.idExpiryDate
    }).subscribe({
      next: (client) => {
        this.isLoading = false;
        this.clients.unshift(client);
        this.successMsg = `Client enrole avec succes ! Wallet: ${client.walletId}`;
        this.form = { name:'', firstName:'', dob:'', birthPlace:'', nationality:'TN', gender:'M', cin:'', phone:'', email:'', address:'', city:'', idType:'', idNumber:'', idIssueDate:'', idExpiryDate:'' };
        this.formFiles = { recto: null, verso: null };
        this.enrollOpen = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Erreur lors de l\'enrolement du client';
      }
    });
  }

  handleRecto(e: any) {
    const f = e.target.files && e.target.files[0];
    if (f) this.formFiles.recto = f.name;
  }

  handleVerso(e: any) {
    const f = e.target.files && e.target.files[0];
    if (f) this.formFiles.verso = f.name;
  }

  editClient(c: any) {
    this.successMsg = '';
    this.errorMsg = '';
    this.form = { name: c.lastName || c.name, firstName: c.firstName || '', dob: c.birthDate || '', birthPlace: c.birthPlace || '', nationality: c.nationality || 'MA', gender: c.gender || 'M', cin: c.cin || '', phone: c.phone || '', email: c.email || '', address: c.address || '', city: c.city || '', idType: c.idType || '', idNumber: c.idNumber || '', idIssueDate: c.idIssueDate || '', idExpiryDate: c.idExpiryDate || '' };
    this.enrollOpen = true;
  }

  viewDetails(c: any) {
    this.successMsg = `Client: ${c.name || c.lastName} — Wallet: ${c.walletId} — Solde: ${c.balance} ${this.ts.currentCurrency}`;
    this.errorMsg = '';
  }
}
