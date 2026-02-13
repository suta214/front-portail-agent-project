import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  standalone: true,
  selector: 'app-agent-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-root" [class.rtl]="ts.currentLang === 'ar'">

      <!-- Page Header -->
      <header class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4zM12 12a4 4 0 100-8 4 4 0 000 8z" stroke="url(#pg-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="pg-grad" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                <stop stop-color="#C8102E"/><stop offset="0.5" stop-color="#E8471B"/><stop offset="1" stop-color="#F7941D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h2>{{ ts.t('profileSettings') }}</h2>
          <p class="header-sub">Gerez votre profil, securite et preferences</p>
        </div>
      </header>

      <div class="content-area">

        <!-- Status Messages -->
        @if (successMessage) {
          <div class="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--success)" stroke-width="2"/>
              <path d="M9 12l2 2 4-4" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ successMessage }}</span>
            <button class="alert-close" (click)="successMessage = ''">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        }
        @if (errorMessage) {
          <div class="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--error)" stroke-width="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="var(--error)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ errorMessage }}</span>
            <button class="alert-close" (click)="errorMessage = ''">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        }

        <!-- Personal Information -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="var(--hps-orange)" stroke-width="2"/>
              </svg>
            </div>
            <h3>{{ ts.t('personalInfo') }}</h3>
          </div>
          <form class="card-body">
            <div class="form-field">
              <label class="field-label">{{ ts.t('fullName') }}</label>
              <input type="text" class="field-input" [(ngModel)]="fullName" name="fullName" />
            </div>
            <div class="form-field">
              <label class="field-label">{{ ts.t('email') }}</label>
              <input type="email" class="field-input" [(ngModel)]="email" name="email" />
            </div>
            <div class="form-field">
              <label class="field-label">{{ ts.t('phone') }}</label>
              <input type="tel" class="field-input" [(ngModel)]="phone" name="phone" />
            </div>
            <div class="card-actions">
              <button type="button" class="btn-primary" (click)="savePersonalInfo()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ ts.t('save') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--hps-orange)" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="16" r="1.5" fill="var(--hps-orange)"/>
              </svg>
            </div>
            <h3>{{ ts.t('security') }}</h3>
          </div>
          <form class="card-body">
            <div class="form-field">
              <label class="field-label">{{ ts.t('currentPwd') }}</label>
              <input type="password" class="field-input" [(ngModel)]="currentPassword" name="currentPassword" />
            </div>
            <div class="form-row-2col">
              <div class="form-field">
                <label class="field-label">{{ ts.t('newPwd') }}</label>
                <input type="password" class="field-input" [(ngModel)]="newPassword" name="newPassword" />
              </div>
              <div class="form-field">
                <label class="field-label">{{ ts.t('confirmPwd') }}</label>
                <input type="password" class="field-input" [(ngModel)]="confirmPassword" name="confirmPassword" />
              </div>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-success" (click)="changePassword()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ ts.t('changePwd') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Language Preferences -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="var(--hps-orange)" stroke-width="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>{{ ts.t('language') }}</h3>
          </div>
          <form class="card-body">
            <div class="form-field">
              <label class="field-label">{{ ts.t('selectLang') }}</label>
              <select class="field-input field-select" [(ngModel)]="selectedLanguage" name="selectedLanguage">
                <option value="fr">Francais</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-outlined" (click)="changeLanguage()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ ts.t('applyLang') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Currency -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="var(--hps-orange)" stroke-width="2"/>
                <path d="M16 8H10.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H8M12 5v2M12 17v2" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>{{ ts.t('currency') }}</h3>
          </div>
          <form class="card-body">
            <div class="form-field">
              <label class="field-label">{{ ts.t('selectCurrency') }}</label>
              <select class="field-input field-select" [(ngModel)]="selectedCurrency" name="selectedCurrency">
                <option value="MAD">MAD - Dirham Marocain</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar US</option>
              </select>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-outlined" (click)="changeCurrency()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ ts.t('applyCurrency') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Other Settings -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="var(--hps-orange)" stroke-width="2"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" stroke="var(--hps-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>{{ ts.t('otherSettings') }}</h3>
          </div>
          <form class="card-body">
            <div class="form-field">
              <label class="toggle-label">
                <div class="toggle-wrapper">
                  <input type="checkbox" class="toggle-input" [(ngModel)]="notificationsEnabled" name="notificationsEnabled">
                  <span class="toggle-slider"></span>
                </div>
                <span class="toggle-text">{{ ts.t('enableNotif') }}</span>
              </label>
            </div>
            <div class="form-field">
              <label class="toggle-label">
                <div class="toggle-wrapper">
                  <input type="checkbox" class="toggle-input" [(ngModel)]="twoFactorEnabled" name="twoFactorEnabled">
                  <span class="toggle-slider"></span>
                </div>
                <span class="toggle-text">{{ ts.t('twoFactor') }}</span>
              </label>
            </div>
            <div class="form-field">
              <label class="field-label">{{ ts.t('timezone') }}</label>
              <select class="field-input field-select" [(ngModel)]="timezone" name="timezone">
                <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                <option value="Africa/Algiers">Algiers (GMT+1)</option>
                <option value="Europe/Paris">Paris (GMT+1/+2)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-outlined" (click)="saveOtherSettings()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ ts.t('saveSettings') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Logout -->
        <div class="logout-section">
          <button type="button" class="btn-logout" (click)="logout()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ ts.t('logout') }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px 28px;
    }

    /* ---- RTL Support ---- */
    .rtl {
      direction: rtl;
    }

    /* ---- Page Header ---- */
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
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
    .header-sub {
      margin: 4px 0 0;
      color: var(--text-secondary);
      font-size: 0.925rem;
    }

    /* ---- Content Area ---- */
    .content-area {
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ---- Alerts ---- */
    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 500;
      position: relative;
    }
    .alert svg:first-child {
      flex-shrink: 0;
    }
    .alert span {
      flex: 1;
    }
    .alert-success {
      background: var(--success-bg);
      color: var(--success);
      border-left: 4px solid var(--success);
    }
    .alert-error {
      background: var(--error-bg);
      color: var(--error);
      border-left: 4px solid var(--error);
    }
    .alert-close {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      transition: var(--transition-fast);
    }
    .alert-close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.06);
    }

    /* ---- Settings Card ---- */
    .settings-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      border: 1px solid var(--border-light);
      transition: var(--transition-base);
    }
    .settings-card:hover {
      box-shadow: var(--shadow-md);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 24px 0;
    }
    .card-header-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(200,16,46,0.08), rgba(247,148,29,0.08));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* ---- Card Body / Forms ---- */
    .card-body {
      padding: 20px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .field-input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-input);
      font-size: 0.925rem;
      color: var(--text-primary);
      transition: var(--transition-fast);
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
    }
    .field-input:focus {
      border-color: var(--hps-orange);
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
      background: var(--bg-card);
    }
    .field-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 40px;
      cursor: pointer;
    }

    /* ---- Toggle Switch ---- */
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      padding: 8px 0;
    }
    .toggle-wrapper {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .toggle-input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .toggle-slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--border-light);
      border-radius: var(--radius-full);
      transition: var(--transition-fast);
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: var(--radius-full);
      transition: var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .toggle-input:checked + .toggle-slider {
      background: var(--hps-gradient);
    }
    .toggle-input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
    .toggle-text {
      font-size: 0.925rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    /* ---- Card Actions ---- */
    .card-actions {
      display: flex;
      padding-top: 4px;
    }

    /* ---- Buttons ---- */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border: none;
      border-radius: var(--radius-md);
      background: var(--hps-gradient);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: inherit;
    }
    .btn-primary:hover {
      opacity: 0.92;
      box-shadow: var(--shadow-md);
    }
    .btn-success {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border: none;
      border-radius: var(--radius-md);
      background: var(--success);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: inherit;
    }
    .btn-success:hover {
      opacity: 0.92;
      box-shadow: var(--shadow-md);
    }
    .btn-outlined {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: inherit;
    }
    .btn-outlined:hover {
      border-color: var(--hps-orange);
      color: var(--hps-orange);
      background: rgba(232, 71, 27, 0.04);
    }

    /* ---- Logout ---- */
    .logout-section {
      margin-top: 4px;
    }
    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px;
      border: 2px solid var(--error);
      border-radius: var(--radius-lg);
      background: transparent;
      color: var(--error);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-fast);
      font-family: inherit;
    }
    .btn-logout:hover {
      background: var(--error);
      color: #fff;
      box-shadow: var(--shadow-md);
    }

    /* ---- Responsive ---- */
    @media (max-width: 700px) {
      :host { padding: 16px; }
      .content-area { max-width: 100%; }
      .form-row-2col { grid-template-columns: 1fr; }
      .card-body { padding: 16px 18px 20px; }
      .card-header { padding: 16px 18px 0; }
    }
  `]
})
export class AgentProfileComponent implements OnInit {
  fullName = '';
  email = '';
  phone = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  selectedLanguage = 'fr';
  selectedCurrency = 'MAD';
  notificationsEnabled = true;
  twoFactorEnabled = false;
  timezone = 'Africa/Casablanca';

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private profileService: ProfileService, private authService: AuthService, public ts: TranslationService) {
    this.selectedLanguage = ts.currentLang;
    this.selectedCurrency = ts.currentCurrency;
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (p) => { this.fullName = p.fullName; this.email = p.email; this.phone = p.phone; },
      error: () => { this.errorMessage = this.ts.t('profileLoadErr'); }
    });
  }

  savePersonalInfo() {
    if (!this.fullName || !this.email || !this.phone) { this.errorMessage = this.ts.t('fillAll'); return; }
    this.isLoading = true; this.errorMessage = '';
    this.profileService.updateProfile({ fullName: this.fullName, email: this.email, phone: this.phone }).subscribe({
      next: () => { this.isLoading = false; this.successMessage = this.ts.t('infoUpdated'); },
      error: (err) => { this.isLoading = false; this.errorMessage = err?.error?.message || this.ts.t('updateErr'); }
    });
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) { this.errorMessage = this.ts.t('fillAll'); return; }
    if (this.newPassword !== this.confirmPassword) { this.errorMessage = this.ts.t('pwdMismatch'); return; }
    if (this.newPassword.length < 8) { this.errorMessage = this.ts.t('pwdMin8'); return; }
    this.isLoading = true; this.errorMessage = '';
    this.profileService.changePassword({ currentPassword: this.currentPassword, newPassword: this.newPassword }).subscribe({
      next: () => { this.isLoading = false; this.successMessage = this.ts.t('pwdChanged'); this.currentPassword = ''; this.newPassword = ''; this.confirmPassword = ''; },
      error: (err) => { this.isLoading = false; this.errorMessage = err?.error?.message || this.ts.t('changeErr'); }
    });
  }

  changeLanguage() {
    this.ts.setLang(this.selectedLanguage);
    this.profileService.updateSettings({ language: this.selectedLanguage }).subscribe({
      next: () => { this.successMessage = this.ts.t('langApplied'); },
      error: () => { this.successMessage = this.ts.t('langApplied'); }
    });
  }

  changeCurrency() {
    this.ts.setCurrency(this.selectedCurrency);
    this.successMessage = this.ts.t('currencyApplied');
  }

  saveOtherSettings() {
    this.isLoading = true; this.errorMessage = '';
    this.profileService.updateSettings({ notificationsEnabled: this.notificationsEnabled, twoFactorEnabled: this.twoFactorEnabled, timezone: this.timezone }).subscribe({
      next: () => { this.isLoading = false; this.successMessage = this.ts.t('settingsSaved'); },
      error: (err) => { this.isLoading = false; this.errorMessage = err?.error?.message || this.ts.t('error'); }
    });
  }

  logout() { this.authService.logout(); }
}
