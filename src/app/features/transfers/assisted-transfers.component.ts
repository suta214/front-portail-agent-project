import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransferService } from '../../core/services/transfer.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  standalone: true,
  selector: 'app-assisted-transfers',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="transfer-root">
      <header class="page-header">
        <h2>Transfert Assisté</h2>
        <p class="lead">Initier et valider des transferts de fonds pour vos clients</p>
      </header>

      <div class="notice">ℹ️ Assistez vos clients dans l'initiation de transferts sécurisés wallet à wallet ou vers des bénéficiaires enregistrés.</div>

      <section class="choices">
        <h3>Choisir le type de transfert</h3>
        <div class="choice-grid">
          <button class="choice" [class.active]="type==='wallet'" (click)="selectType('wallet')">📟<div class="c-title">Wallet à Wallet</div><div class="c-desc">Transfert entre deux wallets du système</div></button>
          <button class="choice" [class.active]="type==='bank'" (click)="selectType('bank')">🏦<div class="c-title">Vers Compte Bancaire</div><div class="c-desc">Transfert vers un compte bancaire externe</div></button>
          <button class="choice" [class.active]="type==='fav'" (click)="selectType('fav')">⭐<div class="c-title">Bénéficiaire Enregistré</div><div class="c-desc">Transfert vers un bénéficiaire favori</div></button>
        </div>
      </section>

      <section class="card details">
        <div class="card-title">📋 Détails du transfert <div class="steps"><span [class.on]="step===1">1</span><span [class.on]="step===2">2</span><span [class.on]="step===3">3</span></div></div>

        <div class="section"> 
          <h4>Expéditeur</h4>
          <div class="grid">
            <div class="col">
              <label>N° de téléphone *</label>
              <input [(ngModel)]="senderPhone" placeholder="+216 XX XXX XXX" />
            </div>
            <div class="col">
              <label>Nom complet</label>
              <input [(ngModel)]="senderName" placeholder="Nom du client" />
            </div>
            <div class="col">
              <label>Solde disponible</label>
              <input [value]="senderBalance" readonly />
            </div>
          </div>
        </div>

        <div class="section">
          <h4>Bénéficiaire</h4>
          <div class="grid">
            <div class="col">
              <label>N° de téléphone / RIB *</label>
              <input [(ngModel)]="beneficiaryId" placeholder="Entrer le numéro" />
            </div>
            <div class="col">
              <label>Nom du bénéficiaire</label>
              <input [value]="beneficiaryName" readonly placeholder="Vérification automatique" />
            </div>
            <div class="col">
              <label>Type</label>
              <input [value]="beneficiaryType" readonly />
            </div>
          </div>
        </div>

        <div class="section">
          <h4>Montant</h4>
          <div class="grid">
            <div class="col">
              <label>Montant à transférer ({{ ts.currentCurrency }}) *</label>
              <input [(ngModel)]="amount" type="number" />
            </div>
            <div class="col">
              <label>Frais de transfert</label>
              <input [value]="feeDisplay" readonly />
            </div>
            <div class="col">
              <label>Motif du transfert</label>
              <input [(ngModel)]="reason" placeholder="Optionnel" />
            </div>
          </div>
        </div>

        @if (errorMsg) {<div style="margin-top:10px;padding:10px;background:#fee2e2;color:#991b1b;border-radius:8px;">{{ errorMsg }}</div>}
        @if (successMsg) {<div style="margin-top:10px;padding:10px;background:#dcfce7;color:#166534;border-radius:8px;">{{ successMsg }}</div>}
        <div class="actions-row">
          <button class="primary" [disabled]="isLoading" (click)="initiate()">{{ isLoading ? 'Traitement...' : '✅ Initier le transfert' }}</button>
          <button class="muted" (click)="resetAll()">✖ Annuler</button>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
    :host { display:block; padding:18px }
    .page-header h2 { margin:0; color:#1f3a44 }
    .lead { margin:6px 0 14px; color:#6b7b84 }
    .notice { background:#e8f6ff; color:#115293; padding:12px 16px; border-radius:8px; margin-bottom:18px }

    .choices h3 { margin:12px 0 }
    .choice-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:18px }
    .choice { background:#fff; padding:22px; border-radius:12px; text-align:center; border:1px solid transparent; cursor:pointer }
    .choice .c-title { font-weight:700; margin-top:12px }
    .choice .c-desc { color:#7b8890; margin-top:8px }
    .choice.active { border-color:#ff7a2f; box-shadow:0 6px 18px rgba(16,24,32,0.04) }

    .card.details { background:#fff; padding:20px; border-radius:12px; box-shadow:0 6px 18px rgba(16,24,32,0.04) }
    .card-title { display:flex; justify-content:space-between; align-items:center; font-weight:700 }
    .steps span { display:inline-block; width:30px; height:30px; line-height:30px; text-align:center; border-radius:50%; background:#e9eef2; margin-left:6px }
    .steps span.on { background:#ff7a2f; color:#fff }

    .section { margin-top:14px }
    .section h4 { margin:0 0 8px }
    .grid { display:flex; gap:12px }
    .col { flex:1; display:flex; flex-direction:column; gap:8px }
    input { padding:10px 12px; border-radius:8px; border:1px solid rgba(16,24,32,0.06); }

    .actions-row { display:flex; gap:12px; margin-top:18px }
    .primary { background: linear-gradient(90deg,#ff7a2f,#ffb347); border:0; color:#111; padding:10px 16px; border-radius:8px; font-weight:700 }
    .muted { background:transparent; border:1px solid rgba(16,24,32,0.06); padding:10px 14px; border-radius:8px }

    @media (max-width:900px) { .choice-grid { grid-template-columns:repeat(1,1fr) } .grid { flex-direction:column } }
    `
  ]
})
export class AssistedTransfersComponent {
  type: 'wallet' | 'bank' | 'fav' = 'wallet';
  step = 1;
  senderPhone = '';
  senderName = '';
  senderBalance = '0,000 MAD';
  beneficiaryId = '';
  beneficiaryName = '';
  beneficiaryType = '';
  amount: number | null = null;
  fee = 0;
  reason = '';
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  get feeDisplay() { return this.fee ? this.fee + ' ' + this.ts.currentCurrency : '0,000 ' + this.ts.currentCurrency; }

  constructor(private transferService: TransferService, public ts: TranslationService) {}

  selectType(t: 'wallet' | 'bank' | 'fav') {
    this.type = t;
    this.beneficiaryId = '';
    this.beneficiaryName = '';
    this.beneficiaryType = t === 'wallet' ? 'Wallet' : (t === 'bank' ? 'Compte bancaire' : 'Bénéficiaire enregistré');
  }

  initiate() {
    if (!this.senderPhone || !this.beneficiaryId || !this.amount || this.amount <= 0) {
      this.errorMsg = 'Veuillez compléter tous les champs obligatoires'; return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.fee = Math.round(this.amount * 0.005 * 100) / 100;
    this.transferService.initiateTransfer({
      transferType: this.type,
      senderPhone: this.senderPhone,
      beneficiaryPhone: this.beneficiaryId,
      amount: this.amount,
      fees: this.fee,
      reason: this.reason
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = `Transfert initié — Réf: ${res.transactionId}`;
        this.step = 3;
      },
      error: (err) => { this.isLoading = false; this.errorMsg = err?.error?.message || 'Erreur lors du transfert'; }
    });
  }

  resetAll() {
    this.type = 'wallet'; this.step = 1;
    this.senderPhone = ''; this.senderName = ''; this.senderBalance = '0,000 ' + this.ts.currentCurrency;
    this.beneficiaryId = ''; this.beneficiaryName = ''; this.beneficiaryType = '';
    this.amount = null; this.fee = 0; this.reason = '';
    this.errorMsg = ''; this.successMsg = '';
  }
}
