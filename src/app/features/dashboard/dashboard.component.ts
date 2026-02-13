import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
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
          <h1 class="welcome-heading">{{ ts.t('welcome') }}{{ stats?.agentName ? ', ' + stats?.agentName : '' }}</h1>
          <p class="welcome-subtitle">{{ ts.t('overview') }}</p>
        </div>
        <div class="agent-badge">
          <div class="agent-badge-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="agent-badge-info">
            <span class="agent-badge-code">{{ stats?.agentCode || 'AP-00000' }}</span>
            <span class="agent-badge-role">Agent</span>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stat-card">
          <div class="stat-accent accent-red"></div>
          <div class="stat-body">
            <div class="stat-icon-wrap icon-red">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ ts.t('agentBalance') }}</span>
              <span class="stat-value">{{ stats?.agentBalance | number:'1.3-3' }} {{ ts.currentCurrency }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent accent-orange"></div>
          <div class="stat-body">
            <div class="stat-icon-wrap icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ ts.t('commissionBalance') }}</span>
              <span class="stat-value">{{ stats?.commissionBalance | number:'1.3-3' }} {{ ts.currentCurrency }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent accent-gold"></div>
          <div class="stat-body">
            <div class="stat-icon-wrap icon-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ ts.t('todayTx') }}</span>
              <span class="stat-value">{{ stats?.todayTransactionsCount ?? 0 }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services-section">
        <h3 class="section-title">{{ ts.t('services') }}</h3>
        <div class="services-grid">
          <a class="service-card" [routerLink]="['/cash-in']">
            <div class="service-icon service-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="8 12 12 16 16 12"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
              </svg>
            </div>
            <div class="service-label">{{ ts.t('cashIn') }}</div>
            <div class="service-desc">{{ ts.t('cashInDesc') }}</div>
            <div class="service-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>

          <a class="service-card" [routerLink]="['/cash-out']">
            <div class="service-icon service-icon-red">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="16 12 12 8 8 12"/>
                <line x1="12" y1="16" x2="12" y2="8"/>
              </svg>
            </div>
            <div class="service-label">{{ ts.t('cashOut') }}</div>
            <div class="service-desc">{{ ts.t('cashOutDesc') }}</div>
            <div class="service-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>

          <a class="service-card" [routerLink]="['/assisted-transfers']">
            <div class="service-icon service-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </div>
            <div class="service-label">{{ ts.t('transfer') }}</div>
            <div class="service-desc">{{ ts.t('transferDesc') }}</div>
            <div class="service-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>

          <a class="service-card" [routerLink]="['/bill-payments']">
            <div class="service-icon service-icon-amber">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                <path d="M8 7h8"/>
                <path d="M8 11h8"/>
                <path d="M8 15h5"/>
              </svg>
            </div>
            <div class="service-label">{{ ts.t('billPay') }}</div>
            <div class="service-desc">{{ ts.t('billPayDesc') }}</div>
            <div class="service-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions-section">
        <h3 class="section-title">{{ ts.t('quickActions') }}</h3>
        <div class="quick-actions-grid">
          <button class="quick-action-btn" (click)="router.navigate(['/clients'])">
            <div class="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <span>{{ ts.t('newClient') }}</span>
          </button>
          <button class="quick-action-btn" (click)="router.navigate(['/cash-in'])">
            <div class="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span>{{ ts.t('quickCashIn') }}</span>
          </button>
          <button class="quick-action-btn" (click)="router.navigate(['/history'])">
            <div class="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span>{{ ts.t('viewOps') }}</span>
          </button>
          <button class="quick-action-btn" (click)="router.navigate(['/profile'])">
            <div class="quick-action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <span>{{ ts.t('myCommissions') }}</span>
          </button>
        </div>
      </section>

    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      color: var(--text-primary, #0F172A);
    }

    .dashboard-root {
      padding: 28px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── Welcome Section ── */
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
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
    }

    .agent-badge-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md, 8px);
      background: linear-gradient(135deg, var(--hps-red, #C8102E), var(--hps-orange, #E8471B));
      color: #FFFFFF;
    }

    .agent-badge-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .agent-badge-code {
      font-weight: 700;
      font-size: 14px;
      color: var(--text-primary, #0F172A);
    }

    .agent-badge-role {
      font-size: 12px;
      color: var(--text-muted, #94A3B8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── Stats Section ── */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      background: var(--bg-card, #FFFFFF);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
      overflow: hidden;
      border: 1px solid var(--border-light, #E2E8F0);
      transition: var(--transition-base, all 0.2s ease);
    }

    .stat-card:hover {
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
      transform: translateY(-1px);
    }

    .stat-accent {
      width: 4px;
      flex-shrink: 0;
    }

    .accent-red { background: var(--hps-red, #C8102E); }
    .accent-orange { background: var(--hps-orange, #E8471B); }
    .accent-gold { background: var(--hps-gold, #FFB81C); }

    .stat-body {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 22px 20px;
      flex: 1;
    }

    .stat-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md, 8px);
      flex-shrink: 0;
    }

    .icon-red {
      background: rgba(200, 16, 46, 0.08);
      color: var(--hps-red, #C8102E);
    }

    .icon-orange {
      background: rgba(232, 71, 27, 0.08);
      color: var(--hps-orange, #E8471B);
    }

    .icon-gold {
      background: rgba(255, 184, 28, 0.1);
      color: var(--hps-amber, #F7941D);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .stat-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary, #475569);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary, #0F172A);
      letter-spacing: -0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Section Titles ── */
    .section-title {
      margin: 0 0 18px;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary, #0F172A);
      position: relative;
      padding-left: 14px;
    }

    .section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: 2px;
      bottom: 2px;
      width: 4px;
      border-radius: 2px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
    }

    [dir="rtl"] .section-title {
      padding-left: 0;
      padding-right: 14px;
    }

    [dir="rtl"] .section-title::before {
      left: auto;
      right: 0;
    }

    /* ── Services Grid ── */
    .services-section {
      margin-bottom: 32px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .service-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bg-card, #FFFFFF);
      padding: 28px 20px 24px;
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--border-light, #E2E8F0);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
      text-decoration: none;
      color: inherit;
      transition: var(--transition-base, all 0.2s ease);
      cursor: pointer;
      overflow: hidden;
    }

    .service-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--hps-gradient, linear-gradient(135deg, #C8102E 0%, #E8471B 50%, #F7941D 100%));
      opacity: 0;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
      border-color: transparent;
    }

    .service-card:hover::after {
      opacity: 1;
    }

    .service-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg, 12px);
      margin-bottom: 16px;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .service-icon-green {
      background: rgba(5, 150, 105, 0.08);
      color: var(--success, #059669);
    }

    .service-icon-red {
      background: rgba(200, 16, 46, 0.08);
      color: var(--hps-red, #C8102E);
    }

    .service-icon-blue {
      background: rgba(37, 99, 235, 0.08);
      color: var(--info, #2563EB);
    }

    .service-icon-amber {
      background: rgba(217, 119, 6, 0.08);
      color: var(--warning, #D97706);
    }

    .service-card:hover .service-icon {
      transform: scale(1.08);
    }

    .service-label {
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 6px;
      color: var(--text-primary, #0F172A);
    }

    .service-desc {
      font-size: 13px;
      color: var(--text-muted, #94A3B8);
      text-align: center;
      line-height: 1.5;
    }

    .service-arrow {
      position: absolute;
      top: 14px;
      right: 14px;
      color: var(--text-muted, #94A3B8);
      opacity: 0;
      transform: translateX(-4px);
      transition: var(--transition-fast, all 0.15s ease);
    }

    [dir="rtl"] .service-arrow {
      right: auto;
      left: 14px;
      transform: translateX(4px) scaleX(-1);
    }

    .service-card:hover .service-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    [dir="rtl"] .service-card:hover .service-arrow {
      transform: translateX(0) scaleX(-1);
    }

    /* ── Quick Actions ── */
    .quick-actions-section {
      background: var(--bg-card, #FFFFFF);
      padding: 24px;
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--border-light, #E2E8F0);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-input, #F8FAFC);
      border: 1px solid var(--border-light, #E2E8F0);
      padding: 14px 18px;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary, #0F172A);
      transition: var(--transition-base, all 0.2s ease);
      font-family: inherit;
    }

    .quick-action-btn:hover {
      background: var(--bg-card, #FFFFFF);
      border-color: var(--hps-red, #C8102E);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
      color: var(--hps-red, #C8102E);
    }

    .quick-action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm, 6px);
      background: rgba(200, 16, 46, 0.06);
      color: var(--hps-red, #C8102E);
      flex-shrink: 0;
      transition: var(--transition-fast, all 0.15s ease);
    }

    .quick-action-btn:hover .quick-action-icon {
      background: var(--hps-red, #C8102E);
      color: #FFFFFF;
    }

    /* ── Responsive ── */
    @media (max-width: 1100px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-root {
        padding: 20px 16px;
      }
      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .stats-section {
        grid-template-columns: 1fr;
      }
      .services-grid {
        grid-template-columns: 1fr;
      }
      .quick-actions-grid {
        grid-template-columns: 1fr;
      }
      .welcome-heading {
        font-size: 22px;
      }
    }
    `
  ]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(public router: Router, private profileService: ProfileService, public ts: TranslationService) {}

  ngOnInit() {
    this.profileService.getDashboardStats().subscribe({
      next: (data) => (this.stats = data),
      error: () => {
        this.stats = {
          agentBalance: 45230.500,
          commissionBalance: 1840.750,
          todayTransactionsCount: 12,
          agentName: 'Agent Demo',
          agentCode: 'AP-00042'
        };
      }
    });
  }
}
