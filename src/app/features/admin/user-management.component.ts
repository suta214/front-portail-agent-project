import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminUser, AgentType, Privilege } from '../../core/models';

interface Commission { id: number; label: string; }
interface ProfileOption { name: string; status: string; value: AgentType; }

const ALL_PRIVILEGES: { key: Privilege; label: string }[] = [
  { key: 'CASH_IN',      label: 'Cashin' },
  { key: 'CASH_OUT',     label: 'Cashout' },
  { key: 'TRANSFER',     label: 'Transfert Assisté' },
  { key: 'BILL_PAYMENT', label: 'Paiement factures' },
  { key: 'CLIENT_MGMT',  label: 'Fiche client' },
  { key: 'WALLET_MGMT',  label: 'Solde wallet' },
  { key: 'HISTORY',      label: 'Historique' },
  { key: 'PROFILE',      label: 'Profil' },
  { key: 'AGENT_MGMT',   label: 'Création agent / BO' },
  { key: 'REPORTS',      label: 'Rapports' },
];

@Component({
  standalone: true,
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="um-root">
      <!-- Header -->
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
            <h2>Gestion des utilisateurs</h2>
            <p class="header-subtitle">Recherchez, modifiez et gérez les agents du portail</p>
          </div>
        </div>
      </header>

      <!-- ZONE 1 — Recherche -->
      <section class="search-section">
        <div class="search-grid">
          <div class="form-group">
            <label>Identifiant</label>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Ex: AGENT001" (keyup.enter)="search()" />
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select [(ngModel)]="searchStatus">
              <option value="">Tous</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="LOCKED">LOCKED</option>
            </select>
          </div>
          <div class="search-btn-wrap">
            <button class="btn-primary-gradient" (click)="search()" [disabled]="loading">
              @if (loading) { <span class="spinner"></span> }
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <!-- Alert messages -->
      @if (successMsg) {
        <div class="alert alert-success">✅ {{ successMsg }}</div>
      }
      @if (errorMsg) {
        <div class="alert alert-error">❌ {{ errorMsg }}</div>
      }

      <!-- ZONE 2 — Tableau -->
      <section class="table-section">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @if (users.length === 0 && !loading) {
                <tr><td colspan="5" class="empty-row">Aucun résultat. Lancez une recherche.</td></tr>
              }
              @for (user of users; track user.id) {
                <tr [class.selected-row]="selectedUser?.id === user.id">
                  <td class="mono">{{ user.identifiant }}</td>
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>
                    <span class="badge" [class]="getBadgeClass(user.status)">{{ user.status }}</span>
                  </td>
                  <td class="actions-cell">
                    <button class="action-btn edit-btn" title="Modifier" (click)="selectUser(user)">✏️</button>
                    <button class="action-btn lock-btn" [title]="user.status === 'LOCKED' ? 'Déverrouiller' : 'Verrouiller'" (click)="toggleLock(user)">
                      {{ user.status === 'LOCKED' ? '🔓' : '🔒' }}
                    </button>
                    <button class="action-btn delete-btn" title="Supprimer" (click)="deleteUser(user)">🗑️</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (totalResults > 0) {
          <div class="pagination">
            <button class="pag-btn" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">← Précédent</button>
            <span class="pag-info">{{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalResults) }} / {{ totalResults }} résultats</span>
            <button class="pag-btn" [disabled]="currentPage * pageSize >= totalResults" (click)="changePage(currentPage + 1)">Suivant →</button>
          </div>
        }
      </section>

      <!-- ZONE 3 — Fiche détail -->
      @if (selectedUser) {
        <section class="detail-section">
          <div class="detail-header">
            <h3>Fiche : <span class="mono">{{ selectedUser.identifiant }}</span></h3>
            <button class="close-btn" (click)="selectedUser = null">✕ Fermer</button>
          </div>

          <!-- Onglets -->
          <div class="tabs">
            @for (tab of tabs; track tab.id) {
              <button class="tab-btn" [class.active]="activeTab === tab.id" (click)="activeTab = tab.id">
                {{ tab.label }}
              </button>
            }
          </div>

          <!-- Onglet 1 — Détail utilisateur -->
          @if (activeTab === 1) {
            <div class="tab-content">
              <div class="form-grid">
                <div class="form-group">
                  <label>Prénom <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="selectedUser.firstName" />
                </div>
                <div class="form-group">
                  <label>Nom <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="selectedUser.lastName" />
                </div>
                <div class="form-group">
                  <label>Email <span class="required">*</span></label>
                  <input type="email" [(ngModel)]="selectedUser.email" />
                </div>
                <div class="form-group">
                  <label>Numéro de téléphone <span class="required">*</span></label>
                  <input type="tel" [(ngModel)]="selectedUser.phone" />
                </div>
                <div class="form-group">
                  <label>Pièce d'identité <span class="required">*</span></label>
                  <select [(ngModel)]="selectedUser.idType">
                    <option value="CIN">CIN</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Num registre civil">Num registre civil</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>N° pièce d'identité <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="selectedUser.idNumber" />
                </div>
                <div class="form-group">
                  <label>Commission</label>
                  <select [(ngModel)]="selectedUser.commission">
                    <option value="">-- Sélectionner --</option>
                    @for (c of commissions; track c.id) {
                      <option [value]="c.label">{{ c.label }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>RIB</label>
                  <input type="text" [value]="selectedUser.rib" disabled class="readonly-input" />
                </div>
              </div>
              <div class="tab-actions">
                <button class="btn-primary-gradient" (click)="saveDetail()">Sauvegarder</button>
              </div>
            </div>
          }

          <!-- Onglet 2 — Infos Contrat -->
          @if (activeTab === 2) {
            <div class="tab-content">
              <div class="form-grid">
                <div class="form-group">
                  <label>Type de contrat</label>
                  <input type="text" [(ngModel)]="selectedUser.contractType" placeholder="CAUTION / PREPAYE..." />
                </div>
                <div class="form-group">
                  <label>Date de contrat</label>
                  <input type="date" [(ngModel)]="selectedUser.contractDate" />
                </div>
                <div class="form-group">
                  <label>Signataire</label>
                  <input type="text" [(ngModel)]="selectedUser.signatory" />
                </div>
                <div class="form-group">
                  <label>N° Brevet</label>
                  <input type="text" [(ngModel)]="selectedUser.patentNumber" />
                </div>
              </div>
              <div class="tab-actions">
                <button class="btn-primary-gradient" (click)="saveContract()">Sauvegarder</button>
              </div>
            </div>
          }

          <!-- Onglet 3 — Profil -->
          @if (activeTab === 3) {
            <div class="tab-content">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nom du profil</th>
                    <th>Statut du profil</th>
                    <th>Sélection</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of profileOptions; track p.value) {
                    <tr>
                      <td>{{ p.name }}</td>
                      <td><span class="badge badge-green">{{ p.status }}</span></td>
                      <td>
                        <input type="radio" name="profile" [value]="p.value" [(ngModel)]="selectedUser.agentType" />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <div class="tab-actions">
                <button class="btn-primary-gradient" (click)="saveProfile()">Sauvegarder</button>
              </div>
            </div>
          }

          <!-- Onglet 4 — Fonctionnalités -->
          @if (activeTab === 4) {
            <div class="tab-content">
              <div class="features-grid">
                @for (priv of allPrivileges; track priv.key) {
                  <label class="feature-checkbox" [class.checked]="selectedUser.privileges.includes(priv.key)">
                    <input type="checkbox"
                      [checked]="selectedUser.privileges.includes(priv.key)"
                      (change)="togglePrivilege(priv.key)" />
                    <span class="checkmark">
                      @if (selectedUser.privileges.includes(priv.key)) {
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5 6.5-8"/></svg>
                      }
                    </span>
                    <span class="feature-label">{{ priv.label }}</span>
                  </label>
                }
              </div>
              <div class="tab-actions">
                <button class="btn-primary-gradient" (click)="savePrivileges()">Sauvegarder</button>
              </div>
            </div>
          }

          <!-- Onglet 5 — Adresse -->
          @if (activeTab === 5) {
            <div class="tab-content">
              <div class="form-grid">
                <div class="form-group">
                  <label>Ligne 1</label>
                  <input type="text" [(ngModel)]="selectedUser.addressLine1" />
                </div>
                <div class="form-group">
                  <label>Pays</label>
                  <input type="text" [(ngModel)]="selectedUser.country" />
                </div>
                <div class="form-group">
                  <label>Ligne 2</label>
                  <input type="text" [(ngModel)]="selectedUser.addressLine2" />
                </div>
                <div class="form-group">
                  <label>Région</label>
                  <input type="text" [(ngModel)]="selectedUser.region" />
                </div>
                <div class="form-group">
                  <label>Ligne 3</label>
                  <input type="text" [(ngModel)]="selectedUser.addressLine3" />
                </div>
                <div class="form-group">
                  <label>Ville</label>
                  <input type="text" [(ngModel)]="selectedUser.city" />
                </div>
                <div class="form-group">
                  <label>Ligne 4</label>
                  <input type="text" [(ngModel)]="selectedUser.addressLine4" />
                </div>
                <div class="form-group">
                  <label>Code postal</label>
                  <input type="text" [(ngModel)]="selectedUser.postalCode" />
                </div>
              </div>
              <div class="tab-actions">
                <button class="btn-primary-gradient" (click)="saveAddress()">Sauvegarder</button>
              </div>
            </div>
          }

        </section>
      }
    </div>
  `,
  styles: [`
    .um-root { max-width: 1100px; }

    .page-header { display: flex; align-items: center; margin-bottom: 24px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: linear-gradient(135deg, #C8102E, #E8471B, #F7941D);
      color: #fff; display: flex; align-items: center; justify-content: center;
    }
    .page-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .header-subtitle { font-size: 13px; color: var(--text-muted); margin: 2px 0 0; }

    /* Search */
    .search-section {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: 12px; padding: 20px; margin-bottom: 20px;
    }
    .search-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: end; }
    .search-btn-wrap { display: flex; align-items: flex-end; }

    /* Alerts */
    .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; font-weight: 500; }
    .alert-success { background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
    .alert-error { background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

    /* Table */
    .table-section {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: 12px; overflow: hidden; margin-bottom: 20px;
    }
    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th {
      text-align: left; padding: 12px 16px;
      background: var(--bg-input); font-size: 11px; font-weight: 700;
      color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-light);
    }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border-light); color: var(--text-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: rgba(232,71,27,0.02); }
    .selected-row td { background: rgba(200,16,46,0.04) !important; }
    .empty-row { text-align: center; color: var(--text-muted); padding: 32px !important; }
    .mono { font-family: 'Courier New', monospace; font-weight: 600; }

    /* Badges */
    .badge { display: inline-flex; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
    .badge-green  { background: rgba(34,197,94,0.1);  color: #16a34a; }
    .badge-red    { background: rgba(239,68,68,0.1);  color: #dc2626; }
    .badge-gray   { background: rgba(148,163,184,0.1); color: #64748b; }

    /* Action buttons */
    .actions-cell { display: flex; gap: 6px; }
    .action-btn { border: none; background: none; cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; }
    .action-btn:hover { background: var(--bg-input); }

    /* Pagination */
    .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-top: 1px solid var(--border-light); }
    .pag-btn {
      padding: 7px 16px; border: 1px solid var(--border-light); background: var(--bg-card);
      border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
    }
    .pag-btn:hover:not(:disabled) { border-color: var(--hps-red); color: var(--hps-red); }
    .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .pag-info { font-size: 13px; color: var(--text-muted); }

    /* Detail section */
    .detail-section {
      background: var(--bg-card); border: 1px solid var(--border-light);
      border-radius: 12px; padding: 0; overflow: hidden; margin-bottom: 20px;
    }
    .detail-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--border-light);
      background: var(--bg-input);
    }
    .detail-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .close-btn {
      padding: 6px 14px; border: 1px solid var(--border-light); background: var(--bg-card);
      border-radius: 8px; font-size: 13px; cursor: pointer; transition: all 0.15s;
    }
    .close-btn:hover { border-color: var(--hps-red); color: var(--hps-red); }

    /* Tabs */
    .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border-light); padding: 0 20px; background: var(--bg-card); }
    .tab-btn {
      padding: 14px 20px; border: none; background: none; font-size: 13px; font-weight: 500;
      color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent;
      margin-bottom: -1px; transition: all 0.15s;
    }
    .tab-btn:hover { color: var(--text-primary); }
    .tab-btn.active { color: var(--hps-red); border-bottom-color: var(--hps-red); font-weight: 700; }

    .tab-content { padding: 24px 20px; }
    .tab-actions { display: flex; justify-content: flex-end; margin-top: 20px; }

    /* Forms */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
    .required { color: var(--hps-red); }
    .form-group input, .form-group select {
      padding: 10px 14px; border: 1px solid var(--border-light);
      border-radius: 8px; font-size: 13px; font-family: inherit;
      color: var(--text-primary); background: var(--bg-input); outline: none;
      transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: var(--hps-orange);
      box-shadow: 0 0 0 3px rgba(232,71,27,0.08);
    }
    .readonly-input { background: rgba(148,163,184,0.08) !important; cursor: default; }

    /* Features */
    .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .feature-checkbox {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px;
      border: 1px solid var(--border-light); border-radius: 8px; cursor: pointer;
      background: var(--bg-input); transition: all 0.15s;
    }
    .feature-checkbox.checked { border-color: var(--hps-orange); background: rgba(232,71,27,0.06); }
    .feature-checkbox input { display: none; }
    .checkmark {
      width: 20px; height: 20px; border: 2px solid var(--border-medium);
      border-radius: 4px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .feature-checkbox.checked .checkmark { background: var(--hps-orange); border-color: var(--hps-orange); color: #fff; }
    .feature-label { font-size: 13px; font-weight: 500; color: var(--text-primary); }

    /* Buttons */
    .btn-primary-gradient {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 24px; border: none; border-radius: 8px;
      background: linear-gradient(135deg, #C8102E, #E8471B, #F7941D);
      color: #fff; font-size: 13px; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-primary-gradient:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary-gradient:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .spinner {
      width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .search-grid { grid-template-columns: 1fr; }
      .form-grid, .features-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  protected Math = Math;
  users: AdminUser[] = [];
  selectedUser: AdminUser | null = null;
  activeTab = 1;
  loading = false;
  successMsg = '';
  errorMsg = '';

  searchQuery = '';
  searchStatus = '';
  currentPage = 1;
  pageSize = 10;
  totalResults = 0;

  commissions: Commission[] = [];
  allPrivileges = ALL_PRIVILEGES;

  tabs = [
    { id: 1, label: "Détail de l'utilisateur" },
    { id: 2, label: 'Infos Contrat' },
    { id: 3, label: 'Profil' },
    { id: 4, label: 'Fonctionnalités' },
    { id: 5, label: 'Adresse' },
  ];

  profileOptions: ProfileOption[] = [
    { name: 'Administrateur',          status: 'Actif', value: 'ADMIN' },
    { name: 'Back Office',             status: 'Actif', value: 'BACK_OFFICE' },
    { name: 'Agent Propre',            status: 'Actif', value: 'AGENT_PROPRE' },
    { name: 'Mandaté Principal',       status: 'Actif', value: 'AGENT_MANDATE_PRINCIPAL' },
    { name: 'Mandaté Commerçant',      status: 'Actif', value: 'AGENT_MANDATE_COMMERCANT' },
    { name: 'Mandaté Détaillant',      status: 'Actif', value: 'AGENT_MANDATE_DETAILLANT' },
    { name: 'Tous les privilèges',     status: 'Actif', value: 'ALL' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCommissions();
    this.search();
  }

  loadCommissions() {
    this.http.get<Commission[]>(`${environment.apiUrl}/admin/commissions`).subscribe({
      next: (data) => this.commissions = data,
      error: () => this.commissions = [{ id: 1, label: '2%' }, { id: 2, label: '5%' }, { id: 3, label: '10%' }]
    });
  }

  search() {
    this.loading = true;
    this.selectedUser = null;
    const params: any = { page: this.currentPage, pageSize: this.pageSize };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.searchStatus) params['status'] = this.searchStatus;

    this.http.get<any>(`${environment.apiUrl}/admin/users`, { params }).subscribe({
      next: (res) => {
        this.loading = false;
        if (Array.isArray(res)) {
          this.users = res;
          this.totalResults = res.length;
        } else {
          this.users = res.data || res;
          this.totalResults = res.total || this.users.length;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Erreur lors de la recherche';
        setTimeout(() => this.errorMsg = '', 3000);
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.search();
  }

  selectUser(user: AdminUser) {
    this.selectedUser = { ...user };
    this.activeTab = 1;
    this.successMsg = '';
    this.errorMsg = '';
  }

  getBadgeClass(status: string): string {
    if (status === 'ACTIVE') return 'badge badge-green';
    if (status === 'LOCKED') return 'badge badge-red';
    return 'badge badge-gray';
  }

  toggleLock(user: AdminUser) {
    const action = user.status === 'LOCKED' ? 'unlock' : 'lock';
    this.http.put(`${environment.apiUrl}/admin/users/${user.id}/lock`, { action }).subscribe({
      next: () => {
        user.status = action === 'lock' ? 'LOCKED' : 'ACTIVE';
        this.showSuccess(`Utilisateur ${action === 'lock' ? 'verrouillé' : 'déverrouillé'} avec succès`);
      },
      error: () => this.showError('Erreur lors du verrouillage')
    });
  }

  deleteUser(user: AdminUser) {
    if (!window.confirm(`Supprimer l'utilisateur ${user.identifiant} ?`)) return;
    this.http.delete(`${environment.apiUrl}/admin/users/${user.id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.totalResults--;
        if (this.selectedUser?.id === user.id) this.selectedUser = null;
        this.showSuccess('Utilisateur supprimé avec succès');
      },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  togglePrivilege(key: Privilege) {
    if (!this.selectedUser) return;
    const idx = this.selectedUser.privileges.indexOf(key);
    if (idx >= 0) {
      this.selectedUser.privileges = this.selectedUser.privileges.filter(p => p !== key);
    } else {
      this.selectedUser.privileges = [...this.selectedUser.privileges, key];
    }
  }

  saveDetail() {
    if (!this.selectedUser) return;
    this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}`, this.selectedUser).subscribe({
      next: () => this.showSuccess('Informations sauvegardées'),
      error: () => this.showError('Erreur lors de la sauvegarde')
    });
  }

  saveContract() {
    if (!this.selectedUser) return;
    const body = {
      contractType: this.selectedUser.contractType,
      contractDate: this.selectedUser.contractDate,
      signatory: this.selectedUser.signatory,
      patentNumber: this.selectedUser.patentNumber,
    };
    this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}/contract`, body).subscribe({
      next: () => this.showSuccess('Contrat sauvegardé'),
      error: () => this.showError('Erreur lors de la sauvegarde')
    });
  }

  saveProfile() {
    if (!this.selectedUser) return;
    this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}/profile`, { agentType: this.selectedUser.agentType }).subscribe({
      next: () => this.showSuccess('Profil sauvegardé'),
      error: () => this.showError('Erreur lors de la sauvegarde')
    });
  }

  savePrivileges() {
    if (!this.selectedUser) return;
    this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}/privileges`, { privileges: this.selectedUser.privileges }).subscribe({
      next: () => this.showSuccess('Fonctionnalités sauvegardées'),
      error: () => this.showError('Erreur lors de la sauvegarde')
    });
  }

  saveAddress() {
    if (!this.selectedUser) return;
    const body = {
      addressLine1: this.selectedUser.addressLine1,
      addressLine2: this.selectedUser.addressLine2,
      addressLine3: this.selectedUser.addressLine3,
      addressLine4: this.selectedUser.addressLine4,
      country: this.selectedUser.country,
      region: this.selectedUser.region,
      city: this.selectedUser.city,
      postalCode: this.selectedUser.postalCode,
    };
    this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}/address`, body).subscribe({
      next: () => this.showSuccess('Adresse sauvegardée'),
      error: () => this.showError('Erreur lors de la sauvegarde')
    });
  }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => this.successMsg = '', 4000);
  }

  private showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => this.errorMsg = '', 4000);
  }
}
