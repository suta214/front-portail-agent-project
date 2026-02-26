import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentManagementService } from '../../core/services/agent-management.service';
import { TranslationService } from '../../core/services/translation.service';
import { AgentFeature } from '../../core/models';
import { ALL_COUNTRIES, getRegions, getCities } from '../../core/data/geo-data';

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
      @if (successMsg) {
        <div class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ successMsg }}</span>
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

    @media (max-width: 768px) {
      .form-grid, .features-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BoCreationComponent implements OnInit {
  features = BO_FEATURES;
  selectedFeatures = new Set<string>();
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

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
    private router: Router
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
    this.successMsg = '';

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
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      agentType: 'BACK_OFFICE',
      idType: this.form.idType,
      idNumber: this.form.idNumber,
      email: this.form.email,
      emailConfirmation: this.form.emailConfirmation,
      phone: this.form.phone,
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
      features: Array.from(this.selectedFeatures)
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMsg = `Utilisateur BO "${this.form.firstName} ${this.form.lastName}" cree avec succes (ID: ${this.form.identifiant})`;
        this.resetForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMsg = 'Erreur lors de la creation de l\'utilisateur BO';
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
}
