import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { AgentManagementService } from '../../core/services/agent-management.service';
import { TranslationService } from '../../core/services/translation.service';
import { ALL_COUNTRIES, getRegions, getCities } from '../../core/data/geo-data';

const FEATURES = [
  { key: 'ACTIVATION',              label: 'Activation' },
  { key: 'CHARGEMENT_DECHARGEMENT', label: 'Chargement / Déchargement' },
  { key: 'CASH_IN',                 label: 'Cash In' },
  { key: 'CASH_OUT',                label: 'Cash Out' },
  { key: 'N1_500',                  label: 'Ouverture Niveau 1 (500)' },
  { key: 'N2_1000',                 label: 'Ouverture Niveau 2 (1000)' },
  { key: 'N3_5000',                 label: 'Ouverture Niveau 3 (5000)' },
  { key: 'TRANSFERT_ASSISTE',       label: 'Transfert Assisté' },
  { key: 'TRANSFERT_INTER_AGENTS',  label: 'Transfert Inter-Agents' },
  { key: 'CREER_AGENT_PRINCIPAL',   label: 'Créer Agent Principal' },
  { key: 'CREER_AGENT_DETAILLANT',  label: 'Créer Agent Détaillant' },
  { key: 'SUSPENDRE',               label: 'Suspendre' },
  { key: 'REACTIVER',               label: 'Réactiver' },
  { key: 'CLOTURER',                label: 'Clôturer' },
  { key: 'SOLDE_WALLET',            label: 'Consulter Solde Wallet' },
  { key: 'FICHE_CLIENT',            label: 'Fiche Client' },
  { key: 'MODIFICATION_TELEPHONE',  label: 'Modification Téléphone' },
  { key: 'UPGRADE_ACCOUNT',         label: 'Mise à niveau Compte' },
];

@Component({
  standalone: true,
  selector: 'app-agent-creation',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="agent-creation-root">

      <!-- ══════════════════════════════════════════════════════
           ÉCRAN DE SUCCÈS
      ══════════════════════════════════════════════════════ -->
      @if (successData) {

        <!-- Bloc 1 — Bandeau vert -->
        <div class="success-banner">
          <div class="success-banner-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <h2 class="success-title">Agent {{ successData.identifiant }} créé avec succès !</h2>
            <p class="success-subtitle">Les notifications ont été envoyées à <strong>{{ successData.email }}</strong></p>
          </div>
        </div>

        <!-- Bloc 2 — Cards notifications (2 côte à côte) -->
        <div class="notif-cards-row">

          <!-- Card A : EMAIL OTP -->
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
                  <p>Votre compte agent a été créé avec succès.</p>
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

          <!-- Card A : SMS OTP -->
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

          <!-- Card B : Email identifiants -->
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

        <!-- Bloc 3 — Résumé agent -->
        <div class="summary-card">
          <h3 class="summary-card-title">Récapitulatif de l'agent créé</h3>
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
              <span class="summary-label">Type d'agent</span>
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

        <!-- Boutons -->
        <div class="success-actions">
          <button class="btn-primary-gradient" (click)="createAnother()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Créer un autre agent
          </button>
          <button class="btn-secondary" (click)="router.navigate(['/agents'])">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Liste des agents
          </button>
        </div>

      }

      <!-- ══════════════════════════════════════════════════════
           FORMULAIRE
      ══════════════════════════════════════════════════════ -->
      @if (!successData) {

        <header class="page-header">
          <div class="header-left">
            <div class="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div>
              <h2>Créer un Agent Propre</h2>
              <p class="header-subtitle">Remplissez le formulaire pour créer un nouvel agent</p>
            </div>
          </div>
        </header>

        @if (globalError) {
          <div class="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{{ globalError }}</span>
          </div>
        }

        <form (ngSubmit)="onSubmit()" #agentForm="ngForm">

          <!-- ── Section 1 : Informations Agent ── -->
          <section class="form-section">
            <h3 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Informations Agent
            </h3>
            <div class="form-grid">

              <!-- Identifiant -->
              <div class="form-group" [class.has-error]="identifiantError || isFieldInvalid('identifiant')">
                <label>Identifiant <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.identifiant" name="identifiant" required placeholder="Ex: PR-914905" />
                @if (identifiantError) {
                  <span class="field-error">{{ identifiantError }}</span>
                }
                @if (isFieldInvalid('identifiant')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

              <!-- Commission -->
              <div class="form-group">
                <label>Commission <span class="required">*</span></label>
                <select [(ngModel)]="form.commission" name="commission" required>
                  <option value="">-- Sélectionner --</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="custom">Personnalisée</option>
                </select>
              </div>

              <!-- Prénom -->
              <div class="form-group" [class.has-error]="isFieldInvalid('firstName')">
                <label>Prénom <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.firstName" name="firstName" required placeholder="Prénom de l'agent" />
                @if (isFieldInvalid('firstName')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

              <!-- Nom -->
              <div class="form-group" [class.has-error]="isFieldInvalid('lastName')">
                <label>Nom <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.lastName" name="lastName" required placeholder="Nom de l'agent" />
                @if (isFieldInvalid('lastName')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

              <!-- Type d'agent -->
              <div class="form-group">
                <label>Type d'agent <span class="required">*</span></label>
                <select [(ngModel)]="form.agentType" name="agentType" required>
                  <option value="">-- Sélectionner --</option>
                  <option value="AGENT_PROPRE">Agent Propre</option>
                  <option value="AGENT_MANDATE_PRINCIPAL">Mandaté Principal</option>
                  <option value="AGENT_MANDATE_COMMERCANT">Mandaté Commerçant</option>
                  <option value="AGENT_MANDATE_DETAILLANT">Mandaté Détaillant</option>
                </select>
              </div>

              <!-- Pièce d'identité -->
              <div class="form-group">
                <label>Pièce d'identité <span class="required">*</span></label>
                <select [(ngModel)]="form.idType" name="idType" required>
                  <option value="">-- Sélectionner --</option>
                  <option value="CIN">CIN</option>
                  <option value="Passeport">Passeport</option>
                  <option value="Carte Sejour">Carte de Séjour</option>
                </select>
              </div>

              <!-- N° pièce -->
              <div class="form-group">
                <label>N° pièce d'identité <span class="required">*</span></label>
                <input type="text" [(ngModel)]="form.idNumber" name="idNumber" required placeholder="Numéro de la pièce" />
              </div>

              <!-- Email -->
              <div class="form-group" [class.has-error]="emailError || isFieldInvalid('email')">
                <label>Email <span class="required">*</span></label>
                <input type="email" [(ngModel)]="form.email" name="email" required placeholder="email&#64;exemple.com" />
                @if (emailError) {
                  <span class="field-error">{{ emailError }}</span>
                }
                @if (isFieldInvalid('email')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

              <!-- Confirmation Email -->
              <div class="form-group">
                <label>Confirmation Email <span class="required">*</span></label>
                <input type="email" [(ngModel)]="form.emailConfirmation" name="emailConfirmation" required placeholder="Confirmez l'email" />
              </div>

              <!-- Téléphone -->
              <div class="form-group" [class.has-error]="isFieldInvalid('phone')">
                <label>Numéro de téléphone <span class="required">*</span></label>
                <input type="tel" [(ngModel)]="form.phone" name="phone" required placeholder="+212 6XX XXX XXX" />
                @if (isFieldInvalid('phone')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

              <!-- Canal OTP -->
              <div class="form-group form-group-full" [class.has-error]="isFieldInvalid('otpChannel')">
                <label>Canal d'envoi du code OTP <span class="required">*</span></label>
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
                @if (isFieldInvalid('otpChannel')) {
                  <span class="field-error">Ce champ est requis</span>
                }
              </div>

            </div>
          </section>

          <!-- ── Section 2 : Infos Contrat ── -->
          <section class="form-section">
            <h3 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Infos Contrat
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Type règlement</label>
                <select [(ngModel)]="form.contractType" name="contractType">
                  <option value="CAUTION">CAUTION</option>
                  <option value="PREPAYE">PRÉPAYÉ</option>
                  <option value="POSTPAYE">POSTPAYÉ</option>
                </select>
              </div>
              <div class="form-group">
                <label>N° de patente</label>
                <input type="text" [(ngModel)]="form.patentNumber" name="patentNumber" placeholder="Numéro de patente" />
              </div>
              <div class="form-group">
                <label>Date <span class="required">*</span></label>
                <input type="date" [(ngModel)]="form.contractDate" name="contractDate" required />
              </div>
              <div class="form-group">
                <label>Signataire</label>
                <input type="text" [(ngModel)]="form.signatory" name="signatory" placeholder="Nom du signataire" />
              </div>
            </div>
          </section>

          <!-- ── Section 3 : Adresse ── -->
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
                  <option value="">-- Sélectionner --</option>
                  @for (c of allCountries; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Ligne 2</label>
                <input type="text" [(ngModel)]="form.addressLine2" name="addressLine2" placeholder="Complément d'adresse" />
              </div>
              <div class="form-group">
                <label>Région <span class="required">*</span></label>
                @if (availableRegions.length > 0) {
                  <select [(ngModel)]="form.region" name="region" required (ngModelChange)="onRegionChange($event)">
                    <option value="">-- Sélectionner --</option>
                    @for (r of availableRegions; track r) {
                      <option [value]="r">{{ r }}</option>
                    }
                  </select>
                } @else {
                  <input type="text" [(ngModel)]="form.region" name="region" required placeholder="Région / Province" />
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
                    <option value="">-- Sélectionner --</option>
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

          <!-- ── Section 4 : Fonctionnalités accordées ── -->
          <section class="form-section">
            <h3 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Fonctionnalités accordées
            </h3>
            <div class="features-grid">
              @for (f of allFeatures; track f.key) {
                <label class="feature-item" [class.feature-checked]="isFeatureSelected(f.key)">
                  <input type="checkbox"
                    [checked]="isFeatureSelected(f.key)"
                    (change)="toggleFeature(f.key)" />
                  <span class="feature-checkmark">
                    @if (isFeatureSelected(f.key)) {
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5 6.5-8"/></svg>
                    }
                  </span>
                  <span class="feature-text">{{ f.label }}</span>
                </label>
              }
            </div>
          </section>

          <!-- ── Actions ── -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="resetForm()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Réinitialiser
            </button>
            <button type="submit" class="btn-primary-gradient" [disabled]="isSubmitting">
              @if (isSubmitting) { <span class="spinner"></span> }
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              {{ isSubmitting ? 'Création en cours...' : "Créer l'agent" }}
            </button>
          </div>

        </form>
      }
    </div>
  `,
  styles: [`
    .agent-creation-root { max-width: 960px; }

    /* ── Header ── */
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-icon {
      width: 48px; height: 48px; border-radius: var(--radius-lg);
      background: var(--hps-gradient); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .page-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .header-subtitle { font-size: 13px; color: var(--text-muted); margin: 2px 0 0; }

    /* ── Alert ── */
    .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 13px; font-weight: 500; }
    .alert-error { background: var(--error-bg); color: var(--error); border: 1px solid rgba(239,68,68,0.2); }

    /* ── Form Section ── */
    .form-section {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;
    }
    .section-title {
      display: flex; align-items: center; gap: 10px;
      font-size: 15px; font-weight: 700; color: var(--text-primary);
      margin: 0 0 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-light);
    }
    .section-title svg { color: var(--hps-orange); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
    .form-group-full { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.03em; }
    .required { color: var(--hps-red); }

    .form-group input, .form-group select {
      padding: 10px 14px; border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md); font-size: 13px; font-family: inherit;
      color: var(--text-primary); background: var(--bg-input);
      transition: all var(--transition-fast); outline: none;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: var(--hps-orange); box-shadow: 0 0 0 3px rgba(232,71,27,0.08);
    }
    .form-group input::placeholder { color: var(--text-muted); }
    .has-error input, .has-error select { border-color: var(--error) !important; }
    .field-error { font-size: 12px; color: var(--error); font-weight: 500; margin-top: 2px; }

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

    /* ── Features Grid ── */
    .features-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .feature-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md); cursor: pointer;
      transition: all var(--transition-fast); background: var(--bg-input);
    }
    .feature-item:hover { border-color: var(--border-medium); background: rgba(232,71,27,0.02); }
    .feature-checked { border-color: var(--hps-orange) !important; background: rgba(232,71,27,0.05) !important; }
    .feature-item input { display: none; }
    .feature-checkmark {
      width: 18px; height: 18px; border: 2px solid var(--border-medium);
      border-radius: 4px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all var(--transition-fast);
    }
    .feature-checked .feature-checkmark { background: var(--hps-orange); border-color: var(--hps-orange); color: #fff; }
    .feature-text { font-size: 12.5px; font-weight: 500; color: var(--text-primary); }

    /* ── Actions ── */
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; margin-bottom: 24px; }
    .btn-primary-gradient {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 28px; border: none; border-radius: var(--radius-md);
      background: var(--hps-gradient); color: #fff;
      font-size: 14px; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all var(--transition-fast);
    }
    .btn-primary-gradient:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(200,16,46,0.3); }
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
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ══════════════════════════════════════
       SUCCESS SCREEN
    ══════════════════════════════════════ */

    /* Bloc 1 — Bandeau vert */
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

    /* Bloc 2 — Cards notif côte à côte */
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

    /* Bloc 3 — Résumé */
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

    /* Success actions */
    .success-actions { display: flex; gap: 12px; padding-top: 4px; margin-bottom: 24px; }

    @media (max-width: 768px) {
      .form-grid, .features-grid { grid-template-columns: 1fr; }
      .notif-cards-row { flex-direction: column; }
      .otp-cards-row { flex-direction: column; }
    }
  `]
})
export class AgentCreationComponent implements OnInit {
  allFeatures = FEATURES;
  features: string[] = [];
  isSubmitting = false;
  globalError = '';
  identifiantError = '';
  emailError = '';
  validationFieldErrors: string[] = [];
  successData: any = null;

  allCountries = ALL_COUNTRIES;
  availableRegions: string[] = [];
  availableCities: string[] = [];

  form = {
    identifiant: '',
    commission: '',
    firstName: '',
    lastName: '',
    agentType: '',
    idType: '',
    idNumber: '',
    email: '',
    emailConfirmation: '',
    phone: '',
    otpChannel: 'EMAIL' as 'EMAIL' | 'SMS',
    contractType: 'CAUTION',
    patentNumber: '',
    contractDate: new Date().toISOString().split('T')[0],
    signatory: '',
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
    const idx = this.features.indexOf(key);
    if (idx > -1) this.features.splice(idx, 1);
    else this.features.push(key);
  }

  isFeatureSelected(key: string): boolean {
    return this.features.includes(key);
  }

  isFieldInvalid(field: string): boolean {
    return this.validationFieldErrors.includes(field);
  }

  clearErrors() {
    this.globalError = '';
    this.identifiantError = '';
    this.emailError = '';
    this.validationFieldErrors = [];
  }

  handleApiError(err: any) {
    if (err?.name === 'TimeoutError') {
      this.globalError = "Le serveur met trop de temps à répondre. L'agent a peut-être été créé — vérifiez la liste avant de réessayer.";
      return;
    }
    const body = err?.error;
    if (body?.error === 'IDENTIFIANT_ALREADY_EXISTS') {
      this.identifiantError = body.message || 'Cet identifiant est déjà utilisé.';
    } else if (body?.error === 'EMAIL_ALREADY_EXISTS') {
      this.emailError = body.message || 'Cet email est déjà associé à un compte.';
    } else if (body?.error === 'VALIDATION_ERROR') {
      this.validationFieldErrors = body.fields || [];
    } else {
      this.globalError = body?.message || "Erreur lors de la création de l'agent.";
    }
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

  onSubmit() {
    this.clearErrors();

    if (!this.form.identifiant || !this.form.firstName || !this.form.lastName ||
        !this.form.agentType || !this.form.idType || !this.form.idNumber ||
        !this.form.email || !this.form.emailConfirmation || !this.form.phone ||
        !this.form.commission || !this.form.addressLine1 || !this.form.region ||
        !this.form.city || !this.form.contractDate) {
      this.globalError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (this.form.email !== this.form.emailConfirmation) {
      this.globalError = 'Les adresses email ne correspondent pas.';
      return;
    }

    this.isSubmitting = true;

    const body = {
      ...this.form,
      features: this.features.map(key => FEATURES.find(f => f.key === key)?.label ?? key)
    };

    this.agentService.createAgent(body).pipe(
      timeout(20000),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (res: any) => {
        const agent = res?.agent ?? {};
        this.successData = {
          identifiant:  agent.identifiant  ?? this.form.identifiant,
          firstName:    agent.firstName    ?? this.form.firstName,
          lastName:     agent.lastName     ?? this.form.lastName,
          email:        agent.email        ?? this.form.email,
          phone:        agent.phone        ?? this.form.phone,
          agentType:    agent.agentType    ?? this.form.agentType,
          status:       agent.status       ?? 'ACTIF',
          createdAt:    agent.createdAt    ?? new Date().toISOString(),
          otpChannel:   agent.otpChannel   ?? this.form.otpChannel,
        };
      },
      error: (err: any) => {
        this.handleApiError(err);
      }
    });
  }

  createAnother() {
    this.successData = null;
    this.resetForm();
  }

  resetForm() {
    this.form = {
      identifiant: '', commission: '', firstName: '', lastName: '',
      agentType: '', idType: '', idNumber: '', email: '', emailConfirmation: '',
      phone: '', otpChannel: 'EMAIL', contractType: 'CAUTION',
      patentNumber: '', contractDate: new Date().toISOString().split('T')[0],
      signatory: '', addressLine1: '', addressLine2: '', addressLine3: '',
      addressLine4: '', country: 'Maroc', region: '', city: '', postalCode: ''
    };
    this.features = [];
    this.availableRegions = getRegions('Maroc');
    this.availableCities = [];
    this.clearErrors();
  }
}
