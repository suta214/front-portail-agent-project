import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">

      <!-- Left Branding Panel -->
      <div class="brand-panel">
        <div class="brand-gradient-bar"></div>
        <div class="brand-content">
          <div class="brand-logo">
            <img src="hps logo blanc.png" alt="HPS" />
          </div>
          <h1 class="brand-title">Portail Agent</h1>
          <p class="brand-tagline">
            Plateforme de gestion unifiee pour les agents HPS.
            Securisee, performante et fiable.
          </p>
          <div class="brand-features">
            <div class="brand-feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span>Connexion securisee SSL/TLS</span>
            </div>
            <div class="brand-feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <span>Tableau de bord en temps reel</span>
            </div>
            <div class="brand-feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span>Gestion multi-agents</span>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          <span>HPS - Hightech Payment Systems</span>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Connexion</h2>
            <p class="form-subtitle">Entrez vos identifiants pour acceder a votre espace agent</p>
          </div>

          <form (ngSubmit)="login()" #f="ngForm">

            <!-- Agent ID Field -->
            <div class="input-group">
              <label for="agentId">Identifiant</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  id="agentId"
                  type="text"
                  name="agentId"
                  [(ngModel)]="agentId"
                  required
                  autocomplete="username"
                  placeholder="Saisissez votre identifiant"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="input-group">
              <div class="label-row">
                <label for="password">Mot de passe</label>
                <a class="forgot-link" href="#">Mot de passe oublie ?</a>
              </div>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  required
                  autocomplete="current-password"
                  placeholder="Saisissez votre mot de passe"
                />
              </div>
            </div>

            <!-- Error Message -->
            @if (errorMsg) {
              <div class="error-banner">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMsg }}</span>
              </div>
            }

            <!-- Remember Me -->
            <div class="options-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="remember" name="remember" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Se souvenir de moi</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-submit"
              [disabled]="!agentId || !password || isLoading"
            >
              @if (isLoading) {
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <span>Connexion en cours...</span>
              } @else {
                <span>Se connecter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              }
            </button>
          </form>

          <div class="form-footer">
            <p>&copy; 2026 HPS - Tous droits reserves</p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ========================================
       LOGIN PAGE - SPLIT LAYOUT
       ======================================== */

    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .login-page {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary, #F1F5F9);
    }

    /* ----------------------------------------
       LEFT BRAND PANEL
       ---------------------------------------- */

    .brand-panel {
      position: relative;
      width: 480px;
      min-height: 100vh;
      background: #0B0F19;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex-shrink: 0;
    }

    .brand-gradient-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
    }

    .brand-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 48px 40px 52px;
    }

    .brand-logo {
      margin-bottom: 40px;
    }

    .brand-logo img {
      height: 48px;
      width: auto;
      display: block;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 16px;
    }

    .brand-tagline {
      font-size: 15px;
      line-height: 1.7;
      color: #8B92A5;
      margin-bottom: 48px;
      max-width: 340px;
    }

    .brand-features {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .brand-feature {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .feature-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md, 10px);
      background: rgba(232, 71, 27, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hps-orange, #E8471B);
      flex-shrink: 0;
    }

    .brand-feature span {
      font-size: 14px;
      color: #B0B7C8;
      font-weight: 500;
    }

    .brand-footer {
      padding: 24px 48px 32px 52px;
    }

    .brand-footer span {
      font-size: 12px;
      color: #4A5068;
      letter-spacing: 0.04em;
    }

    /* ----------------------------------------
       RIGHT FORM PANEL
       ---------------------------------------- */

    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-card, #FFFFFF);
    }

    .form-container {
      width: 100%;
      max-width: 420px;
    }

    .form-header {
      margin-bottom: 36px;
    }

    .form-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
      letter-spacing: -0.01em;
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 14px;
      color: var(--text-secondary, #475569);
      line-height: 1.5;
    }

    /* ---- Input Groups ---- */

    .input-group {
      margin-bottom: 22px;
    }

    .input-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary, #0F172A);
      margin-bottom: 8px;
      letter-spacing: 0.01em;
    }

    .label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .label-row label {
      margin-bottom: 0;
    }

    .forgot-link {
      font-size: 13px;
      color: var(--hps-orange, #E8471B);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-fast, 0.15s ease);
    }

    .forgot-link:hover {
      color: var(--hps-red, #C8102E);
      text-decoration: underline;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted, #94A3B8);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: color var(--transition-fast, 0.15s ease);
    }

    .input-wrapper input {
      width: 100%;
      height: 48px;
      padding: 0 16px 0 44px;
      border: 1.5px solid var(--border-light, #E2E8F0);
      border-radius: var(--radius-md, 10px);
      background: var(--bg-input, #F8FAFC);
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary, #0F172A);
      outline: none;
      transition:
        border-color var(--transition-fast, 0.15s ease),
        background-color var(--transition-fast, 0.15s ease),
        box-shadow var(--transition-fast, 0.15s ease);
    }

    .input-wrapper input::placeholder {
      color: var(--text-muted, #94A3B8);
      font-weight: 400;
    }

    .input-wrapper input:focus {
      border-color: var(--hps-orange, #E8471B);
      background: var(--bg-card, #FFFFFF);
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.1);
    }

    .input-wrapper:has(input:focus) .input-icon {
      color: var(--hps-orange, #E8471B);
    }

    /* ---- Error Banner ---- */

    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      margin-bottom: 22px;
      background: var(--error-bg, #FEF2F2);
      border: 1px solid rgba(220, 38, 38, 0.15);
      border-radius: var(--radius-md, 10px);
      color: var(--error, #DC2626);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
    }

    .error-banner svg {
      flex-shrink: 0;
    }

    /* ---- Checkbox / Remember Me ---- */

    .options-row {
      margin-bottom: 28px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .checkmark {
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--border-light, #E2E8F0);
      border-radius: var(--radius-sm, 4px);
      background: var(--bg-input, #F8FAFC);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition:
        background var(--transition-fast, 0.15s ease),
        border-color var(--transition-fast, 0.15s ease);
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: var(--hps-orange, #E8471B);
      border-color: var(--hps-orange, #E8471B);
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '';
      display: block;
      width: 5px;
      height: 9px;
      border: solid #FFFFFF;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) translateY(-1px);
    }

    .checkbox-text {
      font-size: 13px;
      color: var(--text-secondary, #475569);
      font-weight: 500;
    }

    /* ---- Submit Button ---- */

    .btn-submit {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      border: none;
      border-radius: var(--radius-md, 10px);
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition:
        opacity var(--transition-fast, 0.15s ease),
        transform var(--transition-fast, 0.15s ease),
        box-shadow var(--transition-fast, 0.15s ease);
      box-shadow: 0 4px 16px rgba(200, 16, 46, 0.25);
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.93;
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(200, 16, 46, 0.35);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(200, 16, 46, 0.2);
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-submit svg {
      flex-shrink: 0;
    }

    /* ---- Spinner Animation ---- */

    .spinner {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ---- Form Footer ---- */

    .form-footer {
      margin-top: 40px;
      text-align: center;
    }

    .form-footer p {
      font-size: 12px;
      color: var(--text-muted, #94A3B8);
      letter-spacing: 0.02em;
    }

    /* ----------------------------------------
       RESPONSIVE
       ---------------------------------------- */

    @media (max-width: 960px) {
      .login-page {
        flex-direction: column;
      }

      .brand-panel {
        width: 100%;
        min-height: auto;
        padding: 0;
      }

      .brand-content {
        padding: 40px 32px 32px 36px;
      }

      .brand-tagline {
        margin-bottom: 24px;
      }

      .brand-features {
        display: none;
      }

      .brand-footer {
        display: none;
      }

      .form-panel {
        padding: 32px 24px;
      }
    }

    @media (max-width: 480px) {
      .brand-content {
        padding: 28px 20px 24px 24px;
      }

      .brand-title {
        font-size: 24px;
      }

      .form-container {
        max-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  agentId = '';
  password = '';
  remember = false;
  isLoading = false;
  errorMsg = '';

  constructor(private router: Router, private authService: AuthService) {}


  login() {
    if (!this.agentId || !this.password) return;
    this.isLoading = true;
    this.errorMsg = '';
    this.authService.login({ agentId: this.agentId, password: this.password }).pipe(
      timeout(20000),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err?.name === 'TimeoutError') {
          this.errorMsg = 'Le serveur ne répond pas. Réessayez.';
        } else {
          this.errorMsg = err?.error?.message || 'Identifiant ou mot de passe incorrect';
        }
      }
    });
  }
}
