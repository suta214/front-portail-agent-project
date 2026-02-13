import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients-management.component').then((m) => m.ClientsManagementComponent),
      },
      {
        path: 'wallets',
        loadComponent: () =>
          import('./features/wallets/wallets-management.component').then((m) => m.WalletsManagementComponent),
      },
      {
        path: 'cash-in',
        loadComponent: () =>
          import('./features/transactions/cash-in.component').then((m) => m.CashInComponent),
      },
      {
        path: 'cash-out',
        loadComponent: () =>
          import('./features/transactions/cash-out.component').then((m) => m.CashOutComponent),
      },
      {
        path: 'bill-payments',
        loadComponent: () =>
          import('./features/payments/bill-payments.component').then((m) => m.BillPaymentsComponent),
      },
      {
        path: 'assisted-transfers',
        loadComponent: () =>
          import('./features/transfers/assisted-transfers.component').then((m) => m.AssistedTransfersComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./features/history/history.component').then((m) => m.HistoryComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/agent-profile.component').then((m) => m.AgentProfileComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
