import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { PrivilegeService } from '../../core/services/privilege.service';
import { TranslationService } from '../../core/services/translation.service';
import { DashboardStats } from '../../core/models';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-root" [style.direction]="ts.currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-text">
          <h1 class="welcome-heading">Bonjour{{ agentName ? ', ' + agentName : '' }} 👋</h1>
          <p class="welcome-subtitle">{{ roleSubtitle }}</p>
        </div>
        <div class="agent-badge">
          <div class="agent-badge-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="agent-badge-info">
            <span class="agent-badge-code">{{ agentCode }}</span>
            <span class="agent-badge-role">{{ ps.getLabel(ps.currentAgentType) }}</span>
          </div>
        </div>
      </section>

      <!-- ── STATS SECTION ─────────────────────────────────────────── -->
      <section class="stats-section">

        <!-- ALL : 3 blocs de stats -->
        @if (ps.currentAgentType === 'ALL') {
          <div class="all-stats-wrapper">

            <!-- Bloc 1 — Statistiques globales -->
            <div class="all-bloc">
              <div class="all-bloc-title">Statistiques globales</div>
              <div class="all-bloc-grid">
                <div class="stat-card">
                  <div class="stat-accent accent-red"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-red">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Nombre d'agents</span>
                      <span class="stat-value">{{ stats?.totalAgents ?? 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-orange"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-orange">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Nombre de clients</span>
                      <span class="stat-value">{{ stats?.activeClients ?? 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-gold"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Volume total</span>
                      <span class="stat-value">{{ stats?.totalVolume | number:'1.0-0' }} MAD</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-blue"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Solde global</span>
                      <span class="stat-value">{{ stats?.globalBalance | number:'1.0-0' }} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bloc 2 — Transactions du jour -->
            <div class="all-bloc">
              <div class="all-bloc-title">Transactions du jour</div>
              <div class="all-bloc-grid">
                <div class="stat-card">
                  <div class="stat-accent accent-green"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-green">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Cash In du jour</span>
                      <span class="stat-value">{{ stats?.todayCashInCount ?? 0 }} <small>opér.</small></span>
                      <span class="stat-sub">{{ stats?.todayCashInAmount | number:'1.0-0' }} MAD</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-red"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-red">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Cash Out du jour</span>
                      <span class="stat-value">{{ stats?.todayCashOutCount ?? 0 }} <small>opér.</small></span>
                      <span class="stat-sub">{{ stats?.todayCashOutAmount | number:'1.0-0' }} MAD</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-blue"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Transferts du jour</span>
                      <span class="stat-value">{{ stats?.todayTransfersCount ?? 0 }} <small>opér.</small></span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-gold"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Factures payées</span>
                      <span class="stat-value">{{ stats?.todayBillPaymentsCount ?? 0 }} <small>opér.</small></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bloc 3 — Gestion -->
            <div class="all-bloc">
              <div class="all-bloc-title">Gestion</div>
              <div class="all-bloc-grid">
                <div class="stat-card">
                  <div class="stat-accent accent-orange"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-orange">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Clients actifs</span>
                      <span class="stat-value">{{ stats?.activeClients ?? 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-blue"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="1.5"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Wallets actifs</span>
                      <span class="stat-value">{{ stats?.totalWallets ?? 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-accent accent-gold"></div>
                  <div class="stat-body">
                    <div class="stat-icon-wrap icon-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div class="stat-info">
                      <span class="stat-label">Transactions en attente</span>
                      <span class="stat-value">{{ stats?.pendingTransactions ?? 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        }

        <!-- ADMIN : stats globales -->
        @if (ps.currentAgentType === 'ADMIN') {
          <div class="stat-card">
            <div class="stat-accent accent-red"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Nombre d'agents</span>
                <span class="stat-value">{{ stats?.totalAgents ?? 0 }}</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-accent accent-orange"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Nombre de clients</span>
                <span class="stat-value">{{ stats?.activeClients ?? 0 }}</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-accent accent-gold"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-gold">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Volume total</span>
                <span class="stat-value">{{ stats?.totalVolume | number:'1.0-0' }} MAD</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-accent accent-blue"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Solde global</span>
                <span class="stat-value">{{ stats?.globalBalance | number:'1.0-0' }} MAD</span>
              </div>
            </div>
          </div>
        }

        <!-- BACK_OFFICE : clients, wallets, transactions en attente -->
        @if (ps.currentAgentType === 'BACK_OFFICE') {
          <div class="stat-card">
            <div class="stat-accent accent-orange"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Clients actifs</span>
                <span class="stat-value">{{ stats?.activeClients ?? 0 }}</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-accent accent-blue"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                  <circle cx="16" cy="14" r="1.5"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Wallets actifs</span>
                <span class="stat-value">{{ stats?.totalWallets ?? 0 }}</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-accent accent-gold"></div>
            <div class="stat-body">
              <div class="stat-icon-wrap icon-gold">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Transactions à valider</span>
                <span class="stat-value">{{ stats?.pendingTransactions ?? 0 }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Agents opérationnels : stats transactions du jour -->
        @if (!ps.isAdmin() && ps.currentAgentType !== 'BACK_OFFICE') {
          @if (ps.has('CASH_IN')) {
            <div class="stat-card">
              <div class="stat-accent accent-green"></div>
              <div class="stat-body">
                <div class="stat-icon-wrap icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="8 12 12 16 16 12"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Cash In du jour</span>
                  <span class="stat-value">{{ stats?.todayCashInCount ?? 0 }} <small>opér.</small></span>
                  <span class="stat-sub">{{ stats?.todayCashInAmount | number:'1.0-0' }} MAD</span>
                </div>
              </div>
            </div>
          }
          @if (ps.has('CASH_OUT')) {
            <div class="stat-card">
              <div class="stat-accent accent-red"></div>
              <div class="stat-body">
                <div class="stat-icon-wrap icon-red">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="16 12 12 8 8 12"/>
                    <line x1="12" y1="16" x2="12" y2="8"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Cash Out du jour</span>
                  <span class="stat-value">{{ stats?.todayCashOutCount ?? 0 }} <small>opér.</small></span>
                  <span class="stat-sub">{{ stats?.todayCashOutAmount | number:'1.0-0' }} MAD</span>
                </div>
              </div>
            </div>
          }
          @if (ps.has('TRANSFER')) {
            <div class="stat-card">
              <div class="stat-accent accent-blue"></div>
              <div class="stat-body">
                <div class="stat-icon-wrap icon-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <polyline points="7 23 3 19 7 15"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Transferts du jour</span>
                  <span class="stat-value">{{ stats?.todayTransfersCount ?? 0 }} <small>opér.</small></span>
                </div>
              </div>
            </div>
          }
          @if (ps.has('BILL_PAYMENT')) {
            <div class="stat-card">
              <div class="stat-accent accent-gold"></div>
              <div class="stat-body">
                <div class="stat-icon-wrap icon-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                    <path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Factures payées</span>
                  <span class="stat-value">{{ stats?.todayBillPaymentsCount ?? 0 }} <small>opér.</small></span>
                </div>
              </div>
            </div>
          }
        }
      </section>

      <!-- ── SERVICES GRID ──────────────────────────────────────────── -->
      @if (ps.currentAgentType !== 'ADMIN' && visibleServices.length > 0) {
        <section class="services-section">
          <h3 class="section-title">Mes services</h3>
          <div class="services-grid">

            @if (ps.has('CASH_IN')) {
              <a class="service-card" [routerLink]="['/cash-in']">
                <div class="service-icon service-icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="8 12 12 16 16 12"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('cashIn') }}</div>
                <div class="service-desc">{{ ts.t('cashInDesc') }}</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

            @if (ps.has('CASH_OUT')) {
              <a class="service-card" [routerLink]="['/cash-out']">
                <div class="service-icon service-icon-red">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="16 12 12 8 8 12"/>
                    <line x1="12" y1="16" x2="12" y2="8"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('cashOut') }}</div>
                <div class="service-desc">{{ ts.t('cashOutDesc') }}</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

            @if (ps.has('TRANSFER')) {
              <a class="service-card" [routerLink]="['/assisted-transfers']">
                <div class="service-icon service-icon-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <polyline points="7 23 3 19 7 15"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('transfer') }}</div>
                <div class="service-desc">{{ ts.t('transferDesc') }}</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

            @if (ps.has('BILL_PAYMENT')) {
              <a class="service-card" [routerLink]="['/bill-payments']">
                <div class="service-icon service-icon-amber">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                    <path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('billPay') }}</div>
                <div class="service-desc">{{ ts.t('billPayDesc') }}</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

            @if (ps.has('CLIENT_MGMT')) {
              <a class="service-card" [routerLink]="['/clients']">
                <div class="service-icon service-icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('clientMgmt') }}</div>
                <div class="service-desc">Gestion et suivi des clients</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

            @if (ps.has('WALLET_MGMT')) {
              <a class="service-card" [routerLink]="['/wallets']">
                <div class="service-icon service-icon-teal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <path d="M2 10h20"/>
                    <circle cx="16" cy="14" r="1.5"/>
                  </svg>
                </div>
                <div class="service-label">{{ ts.t('walletMgmt') }}</div>
                <div class="service-desc">Gestion des wallets clients</div>
                <div class="service-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }

          </div>
        </section>
      }

      <!-- ── QUICK ACTIONS ─────────────────────────────────────────── -->
      <section class="quick-actions-section">
        <h3 class="section-title">Accès rapide</h3>
        <div class="quick-actions-grid">

          @if (ps.has('CASH_IN')) {
            <button class="quick-action-btn" (click)="router.navigate(['/cash-in'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="8 12 12 16 16 12"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                </svg>
              </div>
              <span>Cash In</span>
            </button>
          }

          @if (ps.has('CASH_OUT')) {
            <button class="quick-action-btn" (click)="router.navigate(['/cash-out'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="16 12 12 8 8 12"/>
                  <line x1="12" y1="16" x2="12" y2="8"/>
                </svg>
              </div>
              <span>Cash Out</span>
            </button>
          }

          @if (ps.has('TRANSFER')) {
            <button class="quick-action-btn" (click)="router.navigate(['/assisted-transfers'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
              </div>
              <span>Transfert</span>
            </button>
          }

          @if (ps.has('BILL_PAYMENT')) {
            <button class="quick-action-btn" (click)="router.navigate(['/bill-payments'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                  <path d="M8 7h8"/><path d="M8 11h8"/>
                </svg>
              </div>
              <span>Paiement facture</span>
            </button>
          }

          @if (ps.has('CLIENT_MGMT')) {
            <button class="quick-action-btn" (click)="router.navigate(['/clients'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <span>Gestion clients</span>
            </button>
          }

          @if (ps.has('WALLET_MGMT')) {
            <button class="quick-action-btn" (click)="router.navigate(['/wallets'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <span>Gestion wallets</span>
            </button>
          }

          @if (ps.has('HISTORY')) {
            <button class="quick-action-btn" (click)="router.navigate(['/history'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span>Historique</span>
            </button>
          }

          @if (ps.isAdmin()) {
            <button class="quick-action-btn" (click)="router.navigate(['/agents/create'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 17v-1.5a3.5 3.5 0 00-3.5-3.5h-3A3.5 3.5 0 004 15.5V17"/>
                  <circle cx="8.5" cy="7" r="2.5"/>
                  <line x1="16" y1="8" x2="16" y2="14"/>
                  <line x1="13" y1="11" x2="19" y2="11"/>
                </svg>
              </div>
              <span>Créer un agent</span>
            </button>
            <button class="quick-action-btn" (click)="router.navigate(['/agents/create-bo'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span>Créer un BO</span>
            </button>
            <button class="quick-action-btn" (click)="router.navigate(['/admin/users'])">
              <div class="quick-action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span>Gestion utilisateurs</span>
            </button>
          }

        </div>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; color: var(--text-primary, #0F172A); }

    .dashboard-root {
      padding: 28px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── Welcome ── */
    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .welcome-heading {
      margin: 0 0 6px;
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
      letter-spacing: -0.3px;
    }
    .welcome-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary, #475569);
    }
    .agent-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-card, #FFFFFF);
      padding: 10px 18px;
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--border-light, #E2E8F0);
      box-shadow: var(--shadow-sm);
    }
    .agent-badge-icon {
      display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px;
      border-radius: var(--radius-md, 8px);
      background: linear-gradient(135deg, var(--hps-red, #C8102E), var(--hps-orange, #E8471B));
      color: #FFF;
    }
    .agent-badge-info { display: flex; flex-direction: column; gap: 2px; }
    .agent-badge-code { font-weight: 700; font-size: 14px; color: var(--text-primary, #0F172A); }
    .agent-badge-role { font-size: 12px; color: var(--text-muted, #94A3B8); text-transform: uppercase; letter-spacing: 0.5px; }

    /* ── Stats ── */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      display: flex;
      background: var(--bg-card, #FFFFFF);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      border: 1px solid var(--border-light, #E2E8F0);
      transition: var(--transition-base);
    }
    .stat-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); }
    .stat-accent { width: 4px; flex-shrink: 0; }
    .accent-red    { background: var(--hps-red, #C8102E); }
    .accent-orange { background: var(--hps-orange, #E8471B); }
    .accent-gold   { background: var(--hps-gold, #FFB81C); }
    .accent-blue   { background: #2563EB; }
    .accent-green  { background: #059669; }
    .stat-body { display: flex; align-items: center; gap: 16px; padding: 22px 20px; flex: 1; }
    .stat-icon-wrap {
      display: flex; align-items: center; justify-content: center;
      width: 48px; height: 48px; border-radius: var(--radius-md, 8px); flex-shrink: 0;
    }
    .icon-red    { background: rgba(200,16,46,0.08);  color: var(--hps-red, #C8102E); }
    .icon-orange { background: rgba(232,71,27,0.08);  color: var(--hps-orange, #E8471B); }
    .icon-gold   { background: rgba(255,184,28,0.1);  color: #D97706; }
    .icon-blue   { background: rgba(37,99,235,0.08);  color: #2563EB; }
    .icon-green  { background: rgba(5,150,105,0.08);  color: #059669; }
    .stat-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .stat-label { font-size: 12px; font-weight: 500; color: var(--text-secondary, #475569); text-transform: uppercase; letter-spacing: 0.3px; }
    .stat-value { font-size: 22px; font-weight: 800; color: var(--text-primary, #0F172A); letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stat-value small { font-size: 13px; font-weight: 500; color: var(--text-muted, #94A3B8); }
    .stat-sub { font-size: 12px; color: var(--text-muted, #94A3B8); font-weight: 500; }

    /* ── ALL Stats 3 blocs ── */
    .all-stats-wrapper { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 24px; }
    .all-bloc-title {
      font-size: 11px; font-weight: 700; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.6px;
      margin-bottom: 14px; padding-left: 3px;
      border-left: 3px solid var(--hps-orange, #E8471B);
      padding-left: 10px;
    }
    .all-bloc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    /* ── Section Titles ── */
    .section-title {
      margin: 0 0 18px;
      font-size: 17px; font-weight: 700; color: var(--text-primary, #0F172A);
      position: relative; padding-left: 14px;
    }
    .section-title::before {
      content: ''; position: absolute; left: 0; top: 2px; bottom: 2px;
      width: 4px; border-radius: 2px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
    }

    /* ── Services Grid ── */
    .services-section { margin-bottom: 32px; }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 18px;
    }
    .service-card {
      position: relative; display: flex; flex-direction: column; align-items: center;
      background: var(--bg-card, #FFFFFF); padding: 28px 20px 24px;
      border-radius: var(--radius-lg, 12px); border: 1px solid var(--border-light, #E2E8F0);
      box-shadow: var(--shadow-sm); text-decoration: none; color: inherit;
      transition: var(--transition-base); cursor: pointer; overflow: hidden;
    }
    .service-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E, #E8471B, #F7941D));
      opacity: 0; transition: var(--transition-fast);
    }
    .service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .service-card:hover::after { opacity: 1; }
    .service-icon {
      display: flex; align-items: center; justify-content: center;
      width: 56px; height: 56px; border-radius: var(--radius-lg, 12px);
      margin-bottom: 16px; transition: var(--transition-fast);
    }
    .service-icon-green  { background: rgba(5,150,105,0.08);   color: #059669; }
    .service-icon-red    { background: rgba(200,16,46,0.08);   color: #C8102E; }
    .service-icon-blue   { background: rgba(37,99,235,0.08);   color: #2563EB; }
    .service-icon-amber  { background: rgba(217,119,6,0.08);   color: #D97706; }
    .service-icon-purple { background: rgba(124,58,237,0.08);  color: #7C3AED; }
    .service-icon-teal   { background: rgba(13,148,136,0.08);  color: #0D9488; }
    .service-card:hover .service-icon { transform: scale(1.08); }
    .service-label { font-weight: 700; font-size: 15px; margin-bottom: 6px; color: var(--text-primary, #0F172A); }
    .service-desc { font-size: 13px; color: var(--text-muted, #94A3B8); text-align: center; line-height: 1.5; }
    .service-arrow {
      position: absolute; top: 14px; right: 14px;
      color: var(--text-muted, #94A3B8); opacity: 0;
      transform: translateX(-4px); transition: var(--transition-fast);
    }
    .service-card:hover .service-arrow { opacity: 1; transform: translateX(0); }

    /* ── Quick Actions ── */
    .quick-actions-section {
      background: var(--bg-card, #FFFFFF); padding: 24px;
      border-radius: var(--radius-lg, 12px); border: 1px solid var(--border-light, #E2E8F0);
      box-shadow: var(--shadow-sm);
    }
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: 14px;
    }
    .quick-action-btn {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-input, #F8FAFC); border: 1px solid var(--border-light, #E2E8F0);
      padding: 14px 18px; border-radius: var(--radius-md, 8px);
      cursor: pointer; font-weight: 600; font-size: 14px; color: var(--text-primary, #0F172A);
      transition: var(--transition-base); font-family: inherit;
    }
    .quick-action-btn:hover {
      background: var(--bg-card, #FFFFFF);
      border-color: var(--hps-red, #C8102E);
      box-shadow: var(--shadow-md); color: var(--hps-red, #C8102E);
    }
    .quick-action-icon {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: var(--radius-sm, 6px);
      background: rgba(200,16,46,0.06); color: var(--hps-red, #C8102E);
      flex-shrink: 0; transition: var(--transition-fast);
    }
    .quick-action-btn:hover .quick-action-icon { background: var(--hps-red, #C8102E); color: #FFF; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .dashboard-root { padding: 20px 16px; }
      .welcome-section { flex-direction: column; align-items: flex-start; gap: 16px; }
      .welcome-heading { font-size: 22px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  agentName = '';
  agentCode = '';

  constructor(
    public router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    public ps: PrivilegeService,
    public ts: TranslationService,
  ) {}

  ngOnInit() {
    const info = this.authService.getAgentInfo();
    this.agentName = info?.agentId || '';
    this.agentCode = info?.agentCode || '';

    this.profileService.getDashboardStats().subscribe({
      next: (data) => (this.stats = data),
      error: () => {
        this.stats = {
          agentBalance: 0, commissionBalance: 0,
          todayTransactionsCount: 0, agentName: this.agentName, agentCode: this.agentCode,
          todayCashInCount: 0, todayCashInAmount: 0,
          todayCashOutCount: 0, todayCashOutAmount: 0,
          todayTransfersCount: 0, todayBillPaymentsCount: 0,
          activeClients: 0, totalWallets: 0, pendingTransactions: 0,
          totalAgents: 0, totalVolume: 0, globalBalance: 0,
        };
      }
    });
  }

  get roleSubtitle(): string {
    const subtitles: Record<string, string> = {
      ALL: 'Accès complet — vue globale et opérationnelle du portail',
      ADMIN: 'Vue d\'ensemble globale du portail agent',
      AGENT_PROPRE: 'Tableau de bord de vos opérations du jour',
      BACK_OFFICE: 'Gestion et suivi des clients et wallets',
      AGENT_MANDATE_PRINCIPAL: 'Supervision de vos transactions du jour',
      AGENT_MANDATE_COMMERCANT: 'Vos opérations Cash In / Cash Out du jour',
      AGENT_MANDATE_DETAILLANT: 'Vos opérations Cash In / Cash Out du jour',
    };
    return subtitles[this.ps.currentAgentType] || 'Bienvenue sur votre tableau de bord';
  }

  /** Nombre de services visibles — utilisé pour masquer la section si vide */
  get visibleServices(): string[] {
    const all = ['CASH_IN', 'CASH_OUT', 'TRANSFER', 'BILL_PAYMENT', 'CLIENT_MGMT', 'WALLET_MGMT'];
    return all.filter(p => this.ps.has(p as any));
  }
}
