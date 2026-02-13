import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../core/services/history.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-root">
      <header class="page-header">
        <h2>Historique des Transactions</h2>
      </header>

      <section class="controls">
        <input class="search" [(ngModel)]="searchQuery" placeholder="Rechercher une transaction (ID, client, montant...)" />
        <select [(ngModel)]="typeFilter" (ngModelChange)="onFilterChange()">
          <option value="all">Tous les types</option>
          <option value="cash-in">Cash In</option>
          <option value="cash-out">Cash Out</option>
          <option value="transfer">Transfert</option>
          <option value="payment">Paiement</option>
        </select>
        <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
          <option value="all">Tous les statuts</option>
          <option value="success">Réussi</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
        </select>
        <select [(ngModel)]="dateRange" (ngModelChange)="onFilterChange()">
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="all">Toutes les dates</option>
        </select>
      </section>

      <section class="list">
        @if (isLoading) {<div style="text-align:center;padding:24px;color:#7b8890;">Chargement...</div>}
        @if (errorMsg) {<div style="padding:12px;background:#fee2e2;color:#991b1b;border-radius:8px;margin-bottom:10px;">{{ errorMsg }}</div>}
        @for (transaction of transactions; track transaction.id) {
        <div class="transaction-card" [class]="'status-' + transaction.status">
          <div class="left">
            <div class="icon" [class]="'icon-' + transaction.type">
              {{ getIcon(transaction.type) }}
            </div>
            <div class="meta">
              <div class="title">{{ getTypeLabel(transaction.type) }}</div>
              <div class="sub">ID: {{ transaction.id }} · {{ transaction.client }} · {{ transaction.date }}</div>
              <div class="description">{{ transaction.description }}</div>
            </div>
          </div>
          <div class="middle">
            <div class="amount" [class]="'amount-' + transaction.type">
              {{ transaction.type === 'cash-out' || transaction.type === 'payment' ? '-' : '+' }}{{ transaction.amount }} {{ ts.currentCurrency }}
            </div>
          </div>
          <div class="right">
            <span class="badge" [class]="'badge-' + transaction.status">
              {{ getStatusLabel(transaction.status) }}
            </span>
            <button (click)="viewDetails(transaction)" class="btn-details">Détails</button>
          </div>
        </div>
        }
      </section>

      <!-- Pagination -->
      <div class="pagination">
        <button [disabled]="currentPage === 1" (click)="previousPage()">← Précédent</button>
        <span class="page-info">Page {{ currentPage }} sur {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages" (click)="nextPage()">Suivant →</button>
      </div>

      <!-- Modal Détails -->
      @if (detailsOpen && selectedTransaction) {
      <div class="modal-overlay" (click)="closeDetails()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Détails de la transaction</h3>
            <button class="close-btn" (click)="closeDetails()">✕</button>
          </div>
          <div class="modal-content">
            <div class="detail-row">
              <label>ID Transaction</label>
              <span>{{ selectedTransaction.id }}</span>
            </div>
            <div class="detail-row">
              <label>Type</label>
              <span>{{ getTypeLabel(selectedTransaction.type) }}</span>
            </div>
            <div class="detail-row">
              <label>Client</label>
              <span>{{ selectedTransaction.client }}</span>
            </div>
            <div class="detail-row">
              <label>Montant</label>
              <span class="amount-text">{{ selectedTransaction.amount }} {{ ts.currentCurrency }}</span>
            </div>
            <div class="detail-row">
              <label>Statut</label>
              <span [class]="'status-' + selectedTransaction.status">{{ getStatusLabel(selectedTransaction.status) }}</span>
            </div>
            <div class="detail-row">
              <label>Date & Heure</label>
              <span>{{ selectedTransaction.date }} {{ selectedTransaction.time }}</span>
            </div>
            <div class="detail-row">
              <label>Référence Paiement</label>
              <span>{{ selectedTransaction.reference }}</span>
            </div>
            <div class="detail-row">
              <label>Notes</label>
              <span>{{ selectedTransaction.notes }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-print" (click)="printDetails()">🖨️ Imprimer</button>
            <button class="btn-export" (click)="exportDetails()">📥 Exporter</button>
            <button class="btn-close" (click)="closeDetails()">Fermer</button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; padding: 20px; }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 28px;
      color: #111;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin: 18px 0 24px 0;
      flex-wrap: wrap;
    }

    .search {
      flex: 1;
      min-width: 250px;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid rgba(16, 24, 32, 0.06);
      font-size: 14px;
    }

    select {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid rgba(16, 24, 32, 0.06);
      background: white;
      cursor: pointer;
      min-width: 140px;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .transaction-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(16, 24, 32, 0.04);
      border-left: 4px solid #ddd;
      transition: all 0.3s;
    }

    .transaction-card:hover {
      box-shadow: 0 4px 12px rgba(16, 24, 32, 0.08);
    }

    .transaction-card.status-success {
      border-left-color: #16a34a;
      background: linear-gradient(90deg, rgba(34, 197, 94, 0.02), transparent);
    }

    .transaction-card.status-pending {
      border-left-color: #f59e0b;
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.02), transparent);
    }

    .transaction-card.status-failed {
      border-left-color: #dc2626;
      background: linear-gradient(90deg, rgba(220, 38, 38, 0.02), transparent);
    }

    .left {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      flex: 1;
    }

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .icon-cash-in {
      background: linear-gradient(135deg, #6b8cff, #a78bff);
      color: white;
    }

    .icon-cash-out {
      background: linear-gradient(135deg, #ff7a2f, #ffb347);
      color: white;
    }

    .icon-transfer {
      background: linear-gradient(135deg, #28a745, #34ce57);
      color: white;
    }

    .icon-payment {
      background: linear-gradient(135deg, #17a2b8, #20c997);
      color: white;
    }

    .meta {
      flex: 1;
    }

    .meta .title {
      font-weight: 700;
      font-size: 15px;
      color: #111;
    }

    .meta .sub {
      color: #7b8890;
      font-size: 12px;
      margin-top: 2px;
    }

    .meta .description {
      color: #7b8890;
      font-size: 13px;
      margin-top: 4px;
    }

    .middle {
      flex: 0 0 140px;
      text-align: right;
      margin: 0 20px;
    }

    .amount {
      font-size: 16px;
      font-weight: 700;
      color: #111;
    }

    .amount-cash-in {
      color: #16a34a;
    }

    .amount-cash-out {
      color: #dc2626;
    }

    .amount-transfer {
      color: #2563eb;
    }

    .amount-payment {
      color: #dc2626;
    }

    .right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      min-width: 90px;
      text-align: center;
    }

    .badge-success {
      background: #ecfdf5;
      color: #16a34a;
    }

    .badge-pending {
      background: #fef3c7;
      color: #b45309;
    }

    .badge-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-details {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid rgba(16, 24, 32, 0.1);
      background: white;
      color: #111;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-details:hover {
      background: #f5f5f5;
      border-color: rgba(16, 24, 32, 0.2);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(16, 24, 32, 0.06);
    }

    .pagination button {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid rgba(16, 24, 32, 0.1);
      background: white;
      color: #111;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .pagination button:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: rgba(16, 24, 32, 0.2);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #7b8890;
      font-size: 14px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(16, 24, 32, 0.06);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #111;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #7b8890;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #111;
    }

    .modal-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(16, 24, 32, 0.06);
    }

    .detail-row label {
      font-weight: 600;
      color: #56646d;
      font-size: 13px;
    }

    .detail-row span {
      color: #111;
      font-weight: 500;
      text-align: right;
    }

    .amount-text {
      font-size: 16px;
      font-weight: 700;
      color: #2563eb;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid rgba(16, 24, 32, 0.06);
      background: #f9fafb;
    }

    .modal-actions button {
      flex: 1;
      padding: 10px 14px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
    }

    .btn-print {
      background: #2b7bff;
      color: white;
    }

    .btn-print:hover {
      background: #1e5dbf;
    }

    .btn-export {
      background: #ff7a2f;
      color: white;
    }

    .btn-export:hover {
      background: #e66b1f;
    }

    .btn-close {
      background: #e5e7eb;
      color: #111;
    }

    .btn-close:hover {
      background: #d1d5db;
    }
  `]
})
export class HistoryComponent implements OnInit {
  searchQuery = '';
  typeFilter: 'all' | 'cash-in' | 'cash-out' | 'transfer' | 'payment' = 'all';
  statusFilter: 'all' | 'success' | 'pending' | 'failed' = 'all';
  dateRange: 'today' | 'week' | 'month' | 'all' = 'all';

  currentPage = 1;
  totalPages = 1;
  detailsOpen = false;
  selectedTransaction: any = null;
  transactions: any[] = [];
  isLoading = false;
  errorMsg = '';

  constructor(private historyService: HistoryService, public ts: TranslationService) {}

  ngOnInit() { this.loadTransactions(); }

  loadTransactions() {
    this.isLoading = true;
    this.errorMsg = '';
    this.historyService.getTransactions({
      type: this.typeFilter !== 'all' ? this.typeFilter : undefined,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined,
      dateRange: this.dateRange,
      page: this.currentPage,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.transactions = res.data ?? res.items ?? res;
        this.totalPages = res.totalPages ?? (Math.ceil((res.total ?? this.transactions.length) / 10) || 1);
        this.currentPage = res.page ?? this.currentPage;
      },
      error: () => { this.isLoading = false; this.errorMsg = 'Impossible de charger l\'historique'; }
    });
  }

  onFilterChange() { this.currentPage = 1; this.loadTransactions(); }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = { 'cash-in': '💰', 'cash-out': '💸', 'transfer': '🔄', 'payment': '💳' };
    return icons[type] || '📊';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = { 'cash-in': 'Cash In', 'cash-out': 'Cash Out', 'transfer': 'Transfert', 'payment': 'Paiement' };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = { 'success': 'Réussi', 'pending': 'En attente', 'failed': 'Échoué' };
    return labels[status] || status;
  }

  viewDetails(transaction: any) { this.selectedTransaction = transaction; this.detailsOpen = true; }

  closeDetails() { this.detailsOpen = false; this.selectedTransaction = null; }

  printDetails() { window.print(); }

  exportDetails() {
    if (!this.selectedTransaction) return;
    const data = JSON.stringify(this.selectedTransaction, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-${this.selectedTransaction.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadTransactions(); } }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadTransactions(); } }
}
