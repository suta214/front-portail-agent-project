import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-force-change-password',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fcp-container">
      <div class="fcp-card">
        <!-- Logo -->
        <div class="fcp-logo">
          <img src="hps logo blanc.png" alt="HPS" class="logo-img" onerror="this.style.display='none'" />
          <span class="logo-text">HPS</span>
        </div>

        <!-- Header -->
        <div class="fcp-header">
          <div class="fcp-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="fcp-title">Première connexion</h1>
          <p class="fcp-subtitle">
            Votre compte a été créé par un administrateur.<br/>
            Veuillez définir un nouveau mot de passe pour sécuriser votre accès.
          </p>
        </div>

        <!-- Alert success -->
        @if (successMsg) {
          <div class="alert alert-success">✅ {{ successMsg }}</div>
        }

        <!-- Alert error -->
        @if (errorMsg) {
          <div class="alert alert-error">{{ errorMsg }}</div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #fcp="ngForm">
          <div class="form-group">
            <label for="currentPwd">Mot de passe actuel (temporaire reçu par email)</label>
            <div class="input-wrap">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                id="currentPwd"
                [type]="showCurrent ? 'text' : 'password'"
                [(ngModel)]="currentPassword"
                name="currentPassword"
                required
                placeholder="Mot de passe temporaire"
              />
              <button type="button" class="eye-btn" (click)="showCurrent = !showCurrent">
                @if (showCurrent) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="newPwd">Nouveau mot de passe</label>
            <div class="input-wrap">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <input
                id="newPwd"
                [type]="showNew ? 'text' : 'password'"
                [(ngModel)]="newPassword"
                name="newPassword"
                required
                placeholder="Nouveau mot de passe"
              />
              <button type="button" class="eye-btn" (click)="showNew = !showNew">
                @if (showNew) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPwd">Confirmer le nouveau mot de passe</label>
            <div class="input-wrap">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <input
                id="confirmPwd"
                [type]="showConfirm ? 'text' : 'password'"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Confirmer le mot de passe"
                [class.input-error]="mismatch"
              />
              <button type="button" class="eye-btn" (click)="showConfirm = !showConfirm">
                @if (showConfirm) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            @if (mismatch) {
              <span class="field-error">Les mots de passe ne correspondent pas.</span>
            }
          </div>

          <button
            type="submit"
            class="btn-submit"
            [disabled]="isSubmitting || !currentPassword || !newPassword || !confirmPassword"
          >
            @if (isSubmitting) {
              <span class="spinner"></span>
              Changement en cours...
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Confirmer le changement
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .fcp-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e0a10 0%, #2d0d19 40%, #1a0f20 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }

    .fcp-card {
      background: #fff;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
    }

    .fcp-logo {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      margin-bottom: 28px;
    }
    .logo-img { height: 36px; }
    .logo-text { font-size: 22px; font-weight: 800; color: #C8102E; letter-spacing: -0.5px; }

    .fcp-header { text-align: center; margin-bottom: 28px; }
    .fcp-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #C8102E, #E8471B);
      color: #fff; margin-bottom: 16px;
    }
    .fcp-title { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 10px; }
    .fcp-subtitle { font-size: 14px; color: #64748B; line-height: 1.6; margin: 0; }

    .alert { padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
    .alert-success { background: rgba(34,197,94,0.1); color: #16a34a; border: 1px solid rgba(34,197,94,0.2); }
    .alert-error { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }

    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
    .form-group label { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; }

    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 14px; color: #94A3B8; flex-shrink: 0; }
    .input-wrap input {
      width: 100%; padding: 12px 44px 12px 42px;
      border: 1.5px solid #E2E8F0; border-radius: 10px;
      font-size: 14px; font-family: inherit; color: #0F172A;
      background: #F8FAFC; outline: none; transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .input-wrap input:focus { border-color: #C8102E; background: #fff; box-shadow: 0 0 0 3px rgba(200,16,46,0.08); }
    .input-wrap input.input-error { border-color: #ef4444; }
    .eye-btn { position: absolute; right: 12px; border: none; background: none; cursor: pointer; color: #94A3B8; padding: 4px; display: flex; align-items: center; }
    .eye-btn:hover { color: #475569; }

    .field-error { font-size: 12px; color: #ef4444; font-weight: 500; }

    .btn-submit {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 14px; border: none; border-radius: 10px;
      background: linear-gradient(135deg, #C8102E 0%, #E8471B 60%, #F7941D 100%);
      color: #fff; font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.2s; margin-top: 8px;
    }
    .btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,16,46,0.35); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ForceChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';
  mismatch = false;

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    this.errorMsg = '';
    this.mismatch = false;

    if (this.newPassword !== this.confirmPassword) {
      this.mismatch = true;
      return;
    }

    this.isSubmitting = true;
    this.http.post(
      `${environment.apiUrl}/auth/force-change-password`,
      { currentPassword: this.currentPassword, newPassword: this.newPassword },
    ).pipe(
      timeout(20000),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        localStorage.setItem('mustChangePassword', 'false');
        this.successMsg = 'Mot de passe changé avec succès !';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.errorMsg = err?.name === 'TimeoutError'
          ? 'Le serveur ne répond pas. Réessayez.'
          : 'Le mot de passe actuel est incorrect.';
      }
    });
  }
}
