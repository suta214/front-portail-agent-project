import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentManagementService } from '../../core/services/agent-management.service';
import { TranslationService } from '../../core/services/translation.service';
import { AgentFeature } from '../../core/models';
import { ALL_COUNTRIES, getRegions, getCities } from '../../core/data/geo-data';
import { finalize, timeout } from 'rxjs/operators';

const BO_FEATURES: AgentFeature[] = [
  { key: 'ACTIVATION', label: 'Activation' },
  { key: 'SUSPENDRE', label: 'Suspendre' },
  { key: 'REACTIVER', label: 'Reactiver' },
  { key: 'CLOTURER', label: 'Cloturer' },
  { key: 'CHARGEMENT_DECHARGEMENT', label: 'Chargement/Dechargement' },
  { key: 'SOLDE_WALLET', label: 'Solde wallet' },
  { key: 'FICHE_CLIENT', label: 'Fiche client' },
  { key: 'ANNULATION_TRANSACTION', label: 'Annulation transaction' },
];

@Component({
  standalone: true,
  selector: 'app-bo-creation',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bo-creation-root">
      <!-- ══════════════════════════════════════════════════════
           ÉCRAN DE SUCCÈS
      ══════════════════════════════════════════════════════ -->
      @if (successData) {

        <div class="success-banner">
          <div class="success-banner-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <h2 class="success-title">Utilisateur BO {{ successData.identifiant }} créé avec succès !</h2>
            <p class="success-subtitle">Les notifications ont été envoyées à <strong>{{ successData.email }}</strong></p>
          </div>
        </div>

        <div class="notif-cards-row">
          @if (successData.otpChannel === 'EMAIL') {
            <div class="notif-card card-blue">
              <div class="card-header">
                <span class="card-header-title">📧 Email de confirmation</span>
                <span class="badge badge-blue">OTP</span>
              </div>
              <div class="email-preview">
                <div class="email-meta">
                  <div class="meta-row"><span class="meta-key">De :</span> noreply&#64;portailagent.ma</div>
                  <div class="meta-row"><span class="meta-key">À :</span> {{ successData.email }}</div>
                  <div class="meta-row"><span class="meta-key">Objet :</span> Bienvenue sur le Portail Agent HPS</div>
                </div>
                <div class="email-body">
                  <p>Bonjour <strong>{{ successData.firstName }} {{ successData.lastName }}</strong>,</p>
                  <p>Votre compte Back Office a été créé avec succès.</p>
                  <p class="otp-label-text">Votre code de confirmation :</p>
                  <div class="otp-dots-row">
                    <span class="otp-dot otp-dot-blue"></span>
                    <span class="otp-dot otp-dot-blue"></span>
                    <span class="otp-dot otp-dot-blue"></span>
                    <span class="otp-dot otp-dot-blue"></span>
                    <span class="otp-dot otp-dot-blue"></span>
                    <span class="otp-dot otp-dot-blue"></span>
                  </div>
                  <p class="otp-validity">Ce code est valable <strong>15 minutes</strong>.</p>
                  <p class="email-sig">Équipe HPS</p>
                </div>
              </div>
              <p class="card-note">Le code OTP a été envoyé uniquement par email pour des raisons de sécurité.</p>
            </div>
          }
          @if (successData.otpChannel === 'SMS') {
            <div class="notif-card card-green">
              <div class="card-header">
                <span class="card-header-title">📱 SMS de confirmation</span>
                <span class="badge badge-green">SMS OTP</span>
              </div>
              <div class="email-preview">
                <div class="email-meta">
                  <div class="meta-row"><span class="meta-key">Expéditeur :</span> HPS-PORTAIL</div>
                  <div class="meta-row"><span class="meta-key">Destinataire :</span> {{ successData.phone }}</div>
                </div>
                <div class="sms-bubble">
                  <p>Bonjour <strong>{{ successData.firstName }}</strong>, votre compte Portail Agent HPS a été créé.</p>
                  <p>Code :</p>
                  <div class="otp-dots-row">
                    <span class="otp-dot otp-dot-green"></span>
                    <span class="otp-dot otp-dot-green"></span>
                    <span class="otp-dot otp-dot-green"></span>
                    <span class="otp-dot otp-dot-green"></span>
                    <span class="otp-dot otp-dot-green"></span>
                    <span class="otp-dot otp-dot-green"></span>
                  </div>
                  <p class="otp-validity">Valable <strong>15 minutes</strong>. Ne le communiquez à personne.</p>
                  <p class="email-sig">HPS</p>
                </div>
              </div>
              <p class="card-note">Le code OTP a été envoyé par SMS au numéro {{ successData.phone }}</p>
            </div>
          }
          <div class="notif-card card-orange">
            <div class="card-header">
              <span class="card-header-title">🔑 Email des identifiants</span>
              <span class="badge badge-orange">CREDENTIALS</span>
            </div>
            <div class="email-preview">
              <div class="email-meta">
                <div class="meta-row"><span class="meta-key">De :</span> noreply&#64;portailagent.ma</div>
                <div class="meta-row"><span class="meta-key">À :</span> {{ successData.email }}</div>
                <div class="meta-row"><span class="meta-key">Objet :</span> Vos identifiants - Portail Agent HPS</div>
              </div>
              <div class="email-body">
                <p>Bonjour <strong>{{ successData.firstName }} {{ successData.lastName }}</strong>,</p>
                <p>Voici vos identifiants de connexion :</p>
                <div class="cred-block">
                  <div>• <strong>Identifiant :</strong> {{ successData.identifiant }}</div>
                  <div>• <strong>Mot de passe :</strong> <span class="masked">●●●●●●●●●●●●</span></div>
                </div>
                @if (successData.otpChannel === 'SMS') {
                  <p class="otp-note-sms">Votre code OTP a été envoyé par SMS au numéro <strong>{{ successData.phone }}</strong>.</p>
                }
                <p class="warning-text">⚠️ Vous devrez changer votre mot de passe lors de votre première connexion.</p>
                <p class="login-link-text">Lien : <span class="link-url">https://portailagent.hps.ma/login</span></p>
                <p class="email-sig">Équipe HPS</p>
              </div>
            </div>
            <p class="card-note">Le mot de passe temporaire a été envoyé uniquement par email pour des raisons de sécurité.</p>
          </div>
        </div>

        <div class="summary-card">
          <h3 class="summary-card-title">Récapitulatif de l'utilisateur BO créé</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Identifiant</span>
              <span class="summary-value mono">{{ successData.identifiant }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Nom complet</span>
              <span class="summary-value">{{ successData.firstName }} {{ successData.lastName }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Email</span>
              <span class="summary-value">{{ successData.email }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Téléphone</span>
              <span class="summary-value">{{ successData.phone }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Type</span>
              <span class="summary-value">{{ agentTypeLabel(successData.agentType) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Canal OTP</span>
              <span class="summary-value">{{ successData.otpChannel === 'EMAIL' ? '📧 Email' : '📱 SMS' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Statut</span>
              <span class="summary-value"><span class="badge-actif">ACTIF</span></span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Créé le</span>
              <span class="summary-value">{{ formatDate(successData.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="success-actions">
          <button class="btn-primary-gradient" (click)="createAnother()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Créer un autre utilisateur BO
          </button>
          <button class="btn-secondary" (click)="router.navigate(['/bo'])">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Liste des utilisateurs BO
          </button>
        </div>

      }

      <!-- ══════════════════════════════════════════════════════
           FORMULAIRE
      ══════════════════════════════════════════════════════ -->
      @if (!successData) {

      <!-- Page Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <h2>Creer un utilisateur BO</h2>
            <p class="header-subtitle">Remplissez le formulaire pour creer un utilisateur Back Office</p>
          </div>
        </div>
      </header>

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

      <form (ngSubmit)="onSubmit()" #boForm="ngForm">
        <!-- Section: Informations Utilisateur BO -->
        <section class="form-section">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Informations Utilisateur
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Identifiant <span class="required">*</span></label>
              <input type="text" [(ngModel)]="form.identifiant" name="identifiant" required placeholder="Ex: BO-646334" />
            </div>
            <div class="form-group">
              <label>Prenom <span class="required">*</span></label>
              <input type="text" [(ngModel)]="form.firstName" name="firstName" required placeholder="Prenom" />
            </div>
            <div class="form-group">
              <label>Nom <span class="required">*</span></label>
              <input type="text" [(ngModel)]="form.lastName" name="lastName" required placeholder="Nom" />
            </div>
            <div class="form-group">
              <label>Piece d'identite <span class="required">*</span></label>
              <select [(ngModel)]="form.idType" name="idType" required>
                <option value="">-- Selectionner --</option>
                <option value="CIN">CIN</option>
                <option value="Passeport">Passeport</option>
                <option value="Carte Sejour">Carte de Sejour</option>
              </select>
            </div>
            <div class="form-group">
              <label>N° piece d'identite <span class="required">*</span></label>
              <input type="text" [(ngModel)]="form.idNumber" name="idNumber" required placeholder="Numero de la piece" />
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input type="email" [(ngModel)]="form.email" name="email" required placeholder="email&#64;exemple.com" />
            </div>
            <div class="form-group">
              <label>Confirmation Email <span class="required">*</span></label>
              <input type="email" [(ngModel)]="form.emailConfirmation" name="emailConfirmation" required placeholder="Confirmez l'email" />
            </div>
            <div class="form-group">
              <label>Numero de telephone <span class="required">*</span></label>
              <input type="tel" [(ngModel)]="form.phone" name="phone" required placeholder="+212 6XX XXX XXX" />
            </div>

          </div>
        </section>

        <!-- Section: Canal OTP -->
        <section class="form-section">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.65-1.65a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>
            Canal d'envoi du code OTP
          </h3>
          <div class="otp-cards-row">
            <!-- EMAIL -->
            <button type="button"
              class="otp-option-card"
              [class.otp-selected-blue]="form.otpChannel === 'EMAIL'"
              (click)="form.otpChannel = 'EMAIL'">
              <div class="otp-option-icon">📧</div>
              <div class="otp-option-body">
                <div class="otp-option-title">Email</div>
                <div class="otp-option-desc">Le code OTP sera envoyé à l'adresse email</div>
              </div>
              <div class="otp-radio-circle" [class.otp-radio-active-blue]="form.otpChannel === 'EMAIL'"></div>
            </button>
            <!-- SMS -->
            <button type="button"
              class="otp-option-card"
              [class.otp-selected-green]="form.otpChannel === 'SMS'"
              (click)="form.otpChannel = 'SMS'">
              <div class="otp-option-icon">📱</div>
              <div class="otp-option-body">
                <div class="otp-option-title">SMS</div>
                <div class="otp-option-desc">Le code OTP sera envoyé au numéro de téléphone</div>
              </div>
              <div class="otp-radio-circle" [class.otp-radio-active-green]="form.otpChannel === 'SMS'"></div>
            </button>
          </div>
          @if (form.otpChannel === 'SMS') {
            <div class="sms-info-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              L'OTP sera envoyé par SMS au numéro de téléphone renseigné (fonctionnalité SMS en cours d'intégration). Le code est enregistré en base et consultable dans les logs backend.
            </div>
          }
        </section>

        <!-- Section: Infos Contrat -->
        <section class="form-section">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Infos Contrat
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Type reglement</label>
              <select [(ngModel)]="form.contractType" name="contractType">
                <option value="CAUTION">CAUTION</option>
                <option value="PREPAYE">PREPAYE</option>
                <option value="POSTPAYE">POSTPAYE</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Section: Adresse -->
        <section class="form-section">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Adresse
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Ligne 1 <span class="required">*</span></label>
              <input type="text" [(ngModel)]="form.addressLine1" name="addressLine1" required placeholder="Adresse principale" />
            </div>
            <div class="form-group">
              <label>Pays <span class="required">*</span></label>
              <select [(ngModel)]="form.country" name="country" required (ngModelChange)="onCountryChange($event)">
                <option value="">-- Selectionner --</option>
                @for (c of allCountries; track c) {
                  <option [value]="c">{{ c }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Ligne 2</label>
              <input type="text" [(ngModel)]="form.addressLine2" name="addressLine2" placeholder="Complement d'adresse" />
            </div>
            <div class="form-group">
              <label>Region <span class="required">*</span></label>
              @if (availableRegions.length > 0) {
                <select [(ngModel)]="form.region" name="region" required (ngModelChange)="onRegionChange($event)">
                  <option value="">-- Selectionner --</option>
                  @for (r of availableRegions; track r) {
                    <option [value]="r">{{ r }}</option>
                  }
                </select>
              } @else {
                <input type="text" [(ngModel)]="form.region" name="region" required placeholder="Region / Province" />
              }
            </div>
            <div class="form-group">
              <label>Ligne 3</label>
              <input type="text" [(ngModel)]="form.addressLine3" name="addressLine3" />
            </div>
            <div class="form-group">
              <label>Ville <span class="required">*</span></label>
              @if (availableCities.length > 0) {
                <select [(ngModel)]="form.city" name="city" required>
                  <option value="">-- Selectionner --</option>
                  @for (v of availableCities; track v) {
                    <option [value]="v">{{ v }}</option>
                  }
                </select>
              } @else {
                <input type="text" [(ngModel)]="form.city" name="city" required placeholder="Ville" />
              }
            </div>
            <div class="form-group">
              <label>Ligne 4</label>
              <input type="text" [(ngModel)]="form.addressLine4" name="addressLine4" />
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input type="text" [(ngModel)]="form.postalCode" name="postalCode" placeholder="Code postal" />
            </div>
          </div>
        </section>

        <!-- Section: Fonctionnalites -->
        <section class="form-section">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Fonctionnalites
          </h3>
          <div class="features-grid">
            @for (feature of features; track feature.key) {
              <label class="feature-checkbox" [class.checked]="selectedFeatures.has(feature.key)">
                <input
                  type="checkbox"
                  [checked]="selectedFeatures.has(feature.key)"
                  (change)="toggleFeature(feature.key)" />
                <span class="checkmark">
                  @if (selectedFeatures.has(feature.key)) {
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5 6.5-8"/></svg>
                  }
                </span>
                <span class="feature-label">{{ feature.label }}</span>
              </label>
            }
          </div>
        </section>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="resetForm()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reinitialiser
          </button>
          <button type="submit" class="btn-primary-gradient" [disabled]="isSubmitting">
            @if (isSubmitting) {
              <span class="spinner"></span>
            }
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            {{ isSubmitting ? 'Creation en cours...' : 'Creer l\\'utilisateur BO' }}
          </button>
        </div>
      </form>
      }
    </div>
  `,
  styles: [`
    .bo-creation-root { max-width: 960px; }

    .page-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-icon {
      width: 48px; height: 48px; border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .page-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .header-subtitle { font-size: 13px; color: var(--text-muted); margin: 2px 0 0; }

    .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 13px; font-weight: 500; }
    .alert-error { background: var(--error-bg); color: var(--error); border: 1px solid rgba(239,68,68,0.2); }
    .alert-success { background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }

    .form-section {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;
    }
    .section-title {
      display: flex; align-items: center; gap: 10px;
      font-size: 16px; font-weight: 700; color: var(--text-primary);
      margin: 0 0 20px; padding-bottom: 12px;
      border-bottom: 1px solid var(--border-light);
    }
    .section-title svg { color: var(--hps-orange); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .required { color: var(--hps-red); }

    .form-group input, .form-group select {
      padding: 10px 14px; border: 1px solid var(--border-light);
      border-radius: var(--radius-md); font-size: 13px; font-family: inherit;
      color: var(--text-primary); background: var(--bg-input);
      transition: all var(--transition-fast); outline: none;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: var(--hps-orange);
      box-shadow: 0 0 0 3px rgba(232, 71, 27, 0.08);
    }
    .form-group input::placeholder { color: var(--text-muted); }
    .readonly-input { background: rgba(148,163,184,0.08) !important; cursor: default; }

    .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .feature-checkbox {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border: 1px solid var(--border-light);
      border-radius: var(--radius-md); cursor: pointer;
      transition: all var(--transition-fast); background: var(--bg-input);
    }
    .feature-checkbox:hover { border-color: var(--border-medium); background: rgba(99, 102, 241, 0.03); }
    .feature-checkbox.checked { border-color: #6366f1; background: rgba(99, 102, 241, 0.06); }
    .feature-checkbox input { display: none; }
    .checkmark {
      width: 20px; height: 20px; border: 2px solid var(--border-medium);
      border-radius: 4px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all var(--transition-fast);
    }
    .feature-checkbox.checked .checkmark { background: #6366f1; border-color: #6366f1; color: #fff; }
    .feature-label { font-size: 13px; font-weight: 500; color: var(--text-primary); }

    .form-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      padding-top: 8px; margin-bottom: 24px;
    }
    .btn-primary-gradient {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 28px; border: none; border-radius: var(--radius-md);
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
      font-size: 14px; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all var(--transition-fast);
    }
    .btn-primary-gradient:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
    .btn-primary-gradient:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-secondary {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 24px; border: 1px solid var(--border-light);
      border-radius: var(--radius-md); background: var(--bg-card);
      color: var(--text-secondary); font-size: 14px; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all var(--transition-fast);
    }
    .btn-secondary:hover { border-color: var(--border-medium); background: var(--bg-input); }

    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── OTP Cards ── */
    .otp-cards-row { display: flex; gap: 12px; margin-top: 4px; }
    .otp-option-card {
      flex: 1; display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; border: 2px solid var(--border-light);
      border-radius: var(--radius-md); background: var(--bg-input);
      cursor: pointer; transition: all var(--transition-fast);
      font-family: inherit; text-align: left;
    }
    .otp-option-card:hover { border-color: var(--border-medium); background: var(--bg-card); }
    .otp-selected-blue { border-color: #1a73e8 !important; background: rgba(26,115,232,0.04) !important; }
    .otp-selected-green { border-color: #34a853 !important; background: rgba(52,168,83,0.04) !important; }
    .otp-option-icon { font-size: 24px; flex-shrink: 0; }
    .otp-option-body { flex: 1; }
    .otp-option-title { font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .otp-option-desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .otp-radio-circle {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-medium); flex-shrink: 0;
      transition: all var(--transition-fast);
    }
    .otp-radio-active-blue { background: #1a73e8; border-color: #1a73e8; box-shadow: inset 0 0 0 3px white; }
    .otp-radio-active-green { background: #34a853; border-color: #34a853; box-shadow: inset 0 0 0 3px white; }
    .sms-info-note {
      display: flex; align-items: flex-start; gap: 7px;
      margin-top: 10px; padding: 10px 14px;
      background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px;
      font-size: 12.5px; color: #92400e; line-height: 1.5;
    }
    .sms-info-note svg { flex-shrink: 0; margin-top: 1px; color: #f59e0b; }

    /* ══════════════════════════════════════
       SUCCESS SCREEN
    ══════════════════════════════════════ */
    .success-banner {
      display: flex; align-items: center; gap: 20px;
      background: rgba(34,197,94,0.07); border: 1.5px solid rgba(34,197,94,0.25);
      border-radius: var(--radius-lg); padding: 24px 28px; margin-bottom: 24px;
    }
    .success-banner-icon {
      width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
      background: rgba(34,197,94,0.12); color: #16a34a;
      display: flex; align-items: center; justify-content: center;
    }
    .success-title { font-size: 20px; font-weight: 800; color: #15803d; margin: 0 0 4px; }
    .success-subtitle { font-size: 13px; color: #166534; margin: 0; }

    .notif-cards-row { display: flex; gap: 20px; margin-bottom: 24px; }
    .notif-card {
      flex: 1; border-radius: var(--radius-lg); border: 2px solid;
      background: var(--bg-card); overflow: hidden;
    }
    .card-blue  { border-color: #1a73e8; }
    .card-green { border-color: #34a853; }
    .card-orange { border-color: #E8471B; }
    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-bottom: 1px solid var(--border-light);
    }
    .card-header-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .badge { font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 99px; letter-spacing: 0.5px; }
    .badge-blue   { background: rgba(26,115,232,0.1); color: #1a73e8; }
    .badge-green  { background: rgba(52,168,83,0.1);  color: #34a853; }
    .badge-orange { background: rgba(232,71,27,0.1);  color: #E8471B; }
    .email-preview { padding: 16px 18px; }
    .email-meta {
      background: var(--bg-input); border-radius: 8px;
      padding: 10px 14px; margin-bottom: 12px;
      font-size: 12px; color: var(--text-secondary);
      display: flex; flex-direction: column; gap: 4px;
    }
    .meta-row { display: flex; gap: 6px; }
    .meta-key { font-weight: 700; color: var(--text-primary); min-width: 70px; }
    .email-body { font-size: 13px; color: var(--text-primary); line-height: 1.65; }
    .email-body p { margin: 0 0 8px; }
    .email-sig { font-style: italic; color: var(--text-muted); font-size: 12px !important; }
    .otp-label-text { font-weight: 600; margin-top: 4px !important; }
    .otp-dots-row { display: flex; gap: 8px; margin: 6px 0 8px; padding: 10px 14px; background: var(--bg-input); border-radius: 8px; width: fit-content; }
    .otp-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .otp-dot-blue  { background: #1a73e8; }
    .otp-dot-green { background: #34a853; }
    .otp-validity { font-size: 12px; color: var(--text-muted); margin: 0 0 4px !important; }
    .sms-bubble {
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 12px 12px 12px 4px; padding: 14px 16px;
      font-size: 13px; color: var(--text-primary); line-height: 1.6;
    }
    .sms-bubble p { margin: 0 0 8px; }
    .cred-block {
      background: var(--bg-input); border-radius: 8px;
      padding: 10px 14px; margin: 6px 0 10px;
      font-size: 13px; display: flex; flex-direction: column; gap: 5px;
    }
    .masked { letter-spacing: 2px; color: var(--text-muted); }
    .otp-note-sms { font-size: 12px; color: #16a34a; font-weight: 500; margin: 0 0 8px !important; }
    .warning-text { color: #b45309; font-size: 12px; font-weight: 500; margin: 0 0 6px !important; }
    .login-link-text { font-size: 12px; color: var(--text-secondary); margin: 0 0 8px !important; }
    .link-url { color: #1a73e8; text-decoration: underline; font-family: monospace; }
    .card-note {
      font-size: 11px; font-style: italic; color: var(--text-muted);
      padding: 10px 18px; border-top: 1px solid var(--border-light); margin: 0;
    }
    .summary-card {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 20px;
    }
    .summary-card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0 0 16px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px 24px; }
    .summary-item { display: flex; flex-direction: column; gap: 3px; }
    .summary-label { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
    .summary-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .mono { font-family: monospace; }
    .badge-actif { display: inline-flex; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; background: rgba(34,197,94,0.1); color: #16a34a; }
    .success-actions { display: flex; gap: 12px; padding-top: 4px; margin-bottom: 24px; }

    @media (max-width: 768px) {
      .form-grid, .features-grid { grid-template-columns: 1fr; }
      .otp-cards-row { flex-direction: column; }
      .notif-cards-row { flex-direction: column; }
    }
  `]
})
export class BoCreationComponent implements OnInit {
  features = BO_FEATURES;
  selectedFeatures = new Set<string>();
  isSubmitting = false;
  errorMsg = '';
  successData: any = null;

  allCountries = ALL_COUNTRIES;
  availableRegions: string[] = [];
  availableCities: string[] = [];

  form = {
    identifiant: '',
    firstName: '',
    lastName: '',
    idType: '',
    idNumber: '',
    email: '',
    emailConfirmation: '',
    phone: '',
    contractType: 'CAUTION',
    otpChannel: 'EMAIL' as 'EMAIL' | 'SMS',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    country: 'Maroc',
    region: '',
    city: '',
    postalCode: ''
  };

  constructor(
    private agentService: AgentManagementService,
    public ts: TranslationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.availableRegions = getRegions('Maroc');
    this.form.country = 'Maroc';
  }

  onCountryChange(country: string) {
    this.form.region = '';
    this.form.city = '';
    this.availableRegions = getRegions(country);
    this.availableCities = [];
  }

  onRegionChange(region: string) {
    this.form.city = '';
    this.availableCities = getCities(this.form.country, region);
  }

  toggleFeature(key: string) {
    if (this.selectedFeatures.has(key)) {
      this.selectedFeatures.delete(key);
    } else {
      this.selectedFeatures.add(key);
    }
  }

  onSubmit() {
    this.errorMsg = '';
    this.successData = null;

    if (!this.form.identifiant || !this.form.firstName || !this.form.lastName ||
        !this.form.idType || !this.form.idNumber || !this.form.email ||
        !this.form.emailConfirmation || !this.form.phone ||
        !this.form.addressLine1 || !this.form.region || !this.form.city) {
      this.errorMsg = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    if (this.form.email !== this.form.emailConfirmation) {
      this.errorMsg = 'Les adresses email ne correspondent pas';
      return;
    }
    if (this.selectedFeatures.size === 0) {
      this.errorMsg = 'Veuillez selectionner au moins une fonctionnalite';
      return;
    }

    this.isSubmitting = true;
    this.agentService.createAgent({
      identifiant: this.form.identifiant,
      commission: '',
      firstName:  this.form.firstName,
      lastName:   this.form.lastName,
      agentType: 'BACK_OFFICE',
      idType: this.form.idType,
      idNumber: this.form.idNumber,
      email: this.form.email,
      emailConfirmation: this.form.emailConfirmation,
      phone: this.form.phone,
      otpChannel: this.form.otpChannel,
      contractType: this.form.contractType,
      patentNumber: '',
      contractDate: new Date().toISOString().split('T')[0],
      signatory: '',
      addressLine1: this.form.addressLine1,
      addressLine2: this.form.addressLine2,
      addressLine3: this.form.addressLine3,
      addressLine4: this.form.addressLine4,
      country: this.form.country,
      region: this.form.region,
      city: this.form.city,
      postalCode: this.form.postalCode,
      features: Array.from(this.selectedFeatures).map(key => BO_FEATURES.find(f => f.key === key)?.label ?? key)
    }).pipe(
      timeout(20000),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (res: any) => {
        const agent = res?.agent ?? {};
        this.successData = {
          identifiant: agent.identifiant ?? this.form.identifiant,
          firstName:   agent.firstName   ?? this.form.firstName,
          lastName:    agent.lastName    ?? this.form.lastName,
          email:       agent.email       ?? this.form.email,
          phone:       agent.phone       ?? this.form.phone,
          agentType:   'BACK_OFFICE',
          status:      agent.status      ?? 'ACTIF',
          createdAt:   agent.createdAt   ?? new Date().toISOString(),
          otpChannel:  agent.otpChannel  ?? this.form.otpChannel,
        };
      },
      error: (err) => {
        this.errorMsg = err?.name === 'TimeoutError'
          ? 'Le serveur ne répond pas. Réessayez.'
          : 'Erreur lors de la creation de l\'utilisateur BO';
      }
    });
  }

  resetForm() {
    this.form = {
      identifiant: '',
      firstName: '',
      lastName: '',
      idType: '',
      idNumber: '',
      email: '',
      emailConfirmation: '',
      phone: '',
      contractType: 'CAUTION',
      otpChannel: 'EMAIL' as 'EMAIL' | 'SMS',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      country: 'Maroc',
      region: '',
      city: '',
      postalCode: ''
    };
    this.availableRegions = getRegions('Maroc');
    this.availableCities = [];
    this.selectedFeatures.clear();
  }

  createAnother() {
    this.successData = null;
    this.resetForm();
  }

  agentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'AGENT_PROPRE': 'Agent Propre',
      'AGENT_MANDATE_PRINCIPAL': 'Mandaté Principal',
      'AGENT_MANDATE_COMMERCANT': 'Mandaté Commerçant',
      'AGENT_MANDATE_DETAILLANT': 'Mandaté Détaillant',
      'BACK_OFFICE': 'Back Office',
      'ADMIN': 'Administrateur',
    };
    return labels[type] ?? type;
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
