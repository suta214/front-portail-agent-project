import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import {
  Client, Wallet, Account, Transaction, Invoice,
  PaginatedTransactions, DashboardStats, AgentProfile,
  TransactionResponse, BeneficiaryVerification, LoginResponse
} from '../models';

// ── Fake Data ────────────────────────────────────────────────────────────────

const MOCK_CLIENTS: Client[] = [
  { id: 1, lastName: 'Bennani', firstName: 'Youssef', cin: 'AB123456', phone: '+212 661 234 567', email: 'youssef.bennani@mail.com', nationality: 'Marocaine', birthDate: '1990-03-15', birthPlace: 'Casablanca', gender: 'M', address: '12 Rue Al Massira, Maarif', city: 'Casablanca', walletId: 'W-100201', balance: 4500, status: 'Actif', kycVerified: true, idType: 'CIN', idNumber: 'AB123456', idIssueDate: '2018-06-01', idExpiryDate: '2028-06-01' },
  { id: 2, lastName: 'El Amrani', firstName: 'Fatima', cin: 'CD789012', phone: '+212 662 345 678', email: 'fatima.amrani@mail.com', nationality: 'Marocaine', birthDate: '1985-11-20', birthPlace: 'Rabat', gender: 'F', address: '45 Ave Hassan II, Agdal', city: 'Rabat', walletId: 'W-100202', balance: 12300, status: 'Actif', kycVerified: true, idType: 'CIN', idNumber: 'CD789012', idIssueDate: '2020-01-15', idExpiryDate: '2030-01-15' },
  { id: 3, lastName: 'Tazi', firstName: 'Mohamed', cin: 'EF345678', phone: '+212 663 456 789', email: 'mohamed.tazi@mail.com', nationality: 'Marocaine', birthDate: '1995-07-08', birthPlace: 'Fes', gender: 'M', address: '8 Rue Ibn Batouta, Ville Nouvelle', city: 'Fes', walletId: 'W-100203', balance: 800, status: 'KYC Incomplet', kycVerified: false, idType: 'CIN', idNumber: 'EF345678', idIssueDate: '2022-03-10', idExpiryDate: '2032-03-10' },
  { id: 4, lastName: 'Alaoui', firstName: 'Sara', cin: 'GH901234', phone: '+212 664 567 890', email: 'sara.alaoui@mail.com', nationality: 'Marocaine', birthDate: '1992-01-25', birthPlace: 'Marrakech', gender: 'F', address: '23 Blvd Zerktouni, Gueliz', city: 'Marrakech', walletId: 'W-100204', balance: 7200, status: 'Actif', kycVerified: true, idType: 'Passeport', idNumber: 'GH901234', idIssueDate: '2019-09-01', idExpiryDate: '2029-09-01' },
  { id: 5, lastName: 'Berrada', firstName: 'Karim', cin: 'IJ567890', phone: '+212 665 678 901', email: 'karim.berrada@mail.com', nationality: 'Marocaine', birthDate: '1988-05-30', birthPlace: 'Tanger', gender: 'M', address: '5 Rue de la Liberte', city: 'Tanger', walletId: 'W-100205', balance: 0, status: 'Suspendu', kycVerified: true, idType: 'CIN', idNumber: 'IJ567890', idIssueDate: '2017-12-01', idExpiryDate: '2027-12-01' },
  { id: 6, lastName: 'Fassi Fihri', firstName: 'Nadia', cin: 'KL234567', phone: '+212 666 789 012', email: 'nadia.fassi@mail.com', nationality: 'Marocaine', birthDate: '1998-09-12', birthPlace: 'Meknes', gender: 'F', address: '17 Ave des FAR', city: 'Meknes', walletId: 'W-100206', balance: 3100, status: 'Actif', kycVerified: true, idType: 'CIN', idNumber: 'KL234567', idIssueDate: '2021-05-20', idExpiryDate: '2031-05-20' },
];

const MOCK_WALLETS: Wallet[] = [
  { id: 1, walletId: 'W-100201', ownerName: 'Youssef Bennani', phone: '+212 661 234 567', email: 'youssef.bennani@mail.com', type: 'Personnel', status: 'Actif', balance: 4500, dailyLimit: 20000, monthlyLimit: 200000, transactionFee: 1.5, currency: 'MAD', kycVerified: true, notes: '' },
  { id: 2, walletId: 'W-100202', ownerName: 'Fatima El Amrani', phone: '+212 662 345 678', email: 'fatima.amrani@mail.com', type: 'Personnel', status: 'Actif', balance: 12300, dailyLimit: 20000, monthlyLimit: 200000, transactionFee: 1.5, currency: 'MAD', kycVerified: true, notes: '' },
  { id: 3, walletId: 'W-100203', ownerName: 'Mohamed Tazi', phone: '+212 663 456 789', email: 'mohamed.tazi@mail.com', type: 'Personnel', status: 'Actif', balance: 800, dailyLimit: 5000, monthlyLimit: 50000, transactionFee: 2.0, currency: 'MAD', kycVerified: false, notes: 'KYC en attente' },
  { id: 4, walletId: 'W-100204', ownerName: 'Sara Alaoui', phone: '+212 664 567 890', email: 'sara.alaoui@mail.com', type: 'Marchand', status: 'Actif', balance: 7200, dailyLimit: 50000, monthlyLimit: 500000, transactionFee: 1.0, currency: 'MAD', kycVerified: true, notes: 'Compte marchand verifie' },
  { id: 5, walletId: 'W-100205', ownerName: 'Karim Berrada', phone: '+212 665 678 901', email: 'karim.berrada@mail.com', type: 'Personnel', status: 'Suspendu', balance: 0, dailyLimit: 20000, monthlyLimit: 200000, transactionFee: 1.5, currency: 'MAD', kycVerified: true, notes: 'Suspendu pour verification' },
  { id: 6, walletId: 'W-100206', ownerName: 'Nadia Fassi Fihri', phone: '+212 666 789 012', email: 'nadia.fassi@mail.com', type: 'Personnel', status: 'Actif', balance: 3100, dailyLimit: 20000, monthlyLimit: 200000, transactionFee: 1.5, currency: 'MAD', kycVerified: true, notes: '' },
];

const MOCK_ACCOUNTS: Account[] = [
  { rib: '007 780 0001234567890 12', accountId: 'ACC-90001', accountType: 'Courant', balance: 4500 },
  { rib: '007 780 0009876543210 34', accountId: 'ACC-90002', accountType: 'Epargne', balance: 12300 },
  { rib: '007 780 0005555666677 56', accountId: 'ACC-90003', accountType: 'Courant', balance: 800 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-240001', type: 'Cash In', clientName: 'Youssef Bennani', amount: 500, date: '2026-02-12T09:15:00', status: 'Réussi', reference: 'REF-CI-240001', fees: 5, agentId: 'AGT-1001', details: 'Depot especes' },
  { id: 'TXN-240002', type: 'Cash Out', clientName: 'Fatima El Amrani', amount: 1000, date: '2026-02-12T10:30:00', status: 'Réussi', reference: 'REF-CO-240002', fees: 10, agentId: 'AGT-1001', details: 'Retrait especes' },
  { id: 'TXN-240003', type: 'Transfert', clientName: 'Mohamed Tazi', amount: 250, date: '2026-02-11T14:45:00', status: 'En attente', reference: 'REF-TR-240003', fees: 3, agentId: 'AGT-1001', details: 'Transfert wallet a wallet' },
  { id: 'TXN-240004', type: 'Paiement', clientName: 'Sara Alaoui', amount: 342.50, date: '2026-02-11T11:20:00', status: 'Réussi', reference: 'REF-BP-240004', fees: 5, agentId: 'AGT-1001', details: 'Paiement facture ONEE' },
  { id: 'TXN-240005', type: 'Cash In', clientName: 'Karim Berrada', amount: 2000, date: '2026-02-10T16:00:00', status: 'Échoué', reference: 'REF-CI-240005', fees: 0, agentId: 'AGT-1001', details: 'Depot rejete - plafond depasse' },
  { id: 'TXN-240006', type: 'Cash Out', clientName: 'Nadia Fassi Fihri', amount: 800, date: '2026-02-10T09:45:00', status: 'Réussi', reference: 'REF-CO-240006', fees: 8, agentId: 'AGT-1001', details: 'Retrait especes' },
  { id: 'TXN-240007', type: 'Transfert', clientName: 'Youssef Bennani', amount: 1500, date: '2026-02-09T13:10:00', status: 'Réussi', reference: 'REF-TR-240007', fees: 15, agentId: 'AGT-1001', details: 'Transfert vers beneficiaire' },
  { id: 'TXN-240008', type: 'Paiement', clientName: 'Fatima El Amrani', amount: 189.00, date: '2026-02-09T08:30:00', status: 'Réussi', reference: 'REF-BP-240008', fees: 3, agentId: 'AGT-1001', details: 'Paiement facture Maroc Telecom' },
  { id: 'TXN-240009', type: 'Cash In', clientName: 'Sara Alaoui', amount: 5000, date: '2026-02-08T15:20:00', status: 'Réussi', reference: 'REF-CI-240009', fees: 50, agentId: 'AGT-1001', details: 'Depot especes' },
  { id: 'TXN-240010', type: 'Cash Out', clientName: 'Mohamed Tazi', amount: 300, date: '2026-02-08T10:05:00', status: 'Réussi', reference: 'REF-CO-240010', fees: 3, agentId: 'AGT-1001', details: 'Retrait especes' },
  { id: 'TXN-240011', type: 'Paiement', clientName: 'Karim Berrada', amount: 750, date: '2026-02-07T17:40:00', status: 'Réussi', reference: 'REF-BP-240011', fees: 8, agentId: 'AGT-1001', details: 'Paiement facture LYDEC' },
  { id: 'TXN-240012', type: 'Transfert', clientName: 'Nadia Fassi Fihri', amount: 400, date: '2026-02-07T11:55:00', status: 'Réussi', reference: 'REF-TR-240012', fees: 4, agentId: 'AGT-1001', details: 'Transfert wallet a wallet' },
];

const MOCK_PROFILE: AgentProfile = {
  id: 1,
  agentId: 'AGT-1001',
  agentCode: 'HPS-AGT-1001',
  fullName: 'Mariam Bougnar',
  email: 'mariam.bougnar@hps-agent.ma',
  phone: '+212 661 000 001',
  language: 'fr',
  timezone: 'Africa/Casablanca',
  notificationsEnabled: true,
  twoFactorEnabled: false,
  balance: 125000,
  commissionBalance: 3450,
  todayTransactionsCount: 47
};

const MOCK_STATS: DashboardStats = {
  agentBalance: 125000,
  commissionBalance: 3450,
  todayTransactionsCount: 47,
  agentName: 'Mariam Bougnar',
  agentCode: 'HPS-AGT-1001'
};

// ── Helper ───────────────────────────────────────────────────────────────────

function genId(): string {
  return 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function json<T>(body: T, statusCode = 200) {
  return of(new HttpResponse({ status: statusCode, body })).pipe(delay(300 + Math.random() * 400));
}

// ── Interceptor ──────────────────────────────────────────────────────────────

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  // Only intercept calls to the API
  if (!url.includes('localhost:8080')) {
    return next(req);
  }

  const path = url.split('localhost:8080')[1]?.split('?')[0] || '';
  const params = new URL(url).searchParams;

  // ── AUTH ──────────────────────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const body = req.body as any;
    if (body?.agentId && body?.password) {
      return json<LoginResponse>({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjoiQUdULTEwMDEiLCJuYW1lIjoiQWhtZWQgTW91c3Nhb3VpIiwiZXhwIjoxOTk5OTk5OTk5fQ.mock-signature',
        agentId: 'AGT-1001',
        agentName: 'Mariam Bougnar',
        agentCode: 'HPS-AGT-1001'
      });
    }
    return json({ message: 'Identifiant ou mot de passe incorrect' }, 401);
  }

  // ── DASHBOARD STATS ──────────────────────────────────────────────────────
  if (path === '/dashboard/stats' && method === 'GET') {
    return json<DashboardStats>(MOCK_STATS);
  }

  // ── PROFILE ──────────────────────────────────────────────────────────────
  if (path === '/profile' && method === 'GET') {
    return json<AgentProfile>(MOCK_PROFILE);
  }
  if (path === '/profile' && method === 'PUT') {
    Object.assign(MOCK_PROFILE, req.body);
    return json({ message: 'Profil mis a jour' });
  }
  if (path === '/profile/password' && method === 'PUT') {
    return json({ message: 'Mot de passe modifie avec succes' });
  }
  if (path === '/profile/settings' && method === 'PUT') {
    Object.assign(MOCK_PROFILE, req.body);
    return json({ message: 'Parametres sauvegardes' });
  }

  // ── CLIENTS ──────────────────────────────────────────────────────────────
  if (path === '/clients/search' && method === 'GET') {
    const phone = params.get('phone') || '';
    const found = MOCK_CLIENTS.filter(c => c.phone.includes(phone));
    return json(found.length ? found[0] : null);
  }
  if (path.match(/^\/clients\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[2]);
    return json(MOCK_CLIENTS.find(c => c.id === id) || null);
  }
  if (path.match(/^\/clients\/\d+$/) && method === 'PUT') {
    const id = parseInt(path.split('/')[2]);
    const client = MOCK_CLIENTS.find(c => c.id === id);
    if (client) Object.assign(client, req.body);
    return json({ message: 'Client mis a jour', client });
  }
  if (path === '/clients' && method === 'POST') {
    const newClient: Client = { ...req.body as any, id: MOCK_CLIENTS.length + 1, walletId: 'W-' + (100207 + MOCK_CLIENTS.length), balance: 0, status: 'KYC Incomplet', kycVerified: false };
    MOCK_CLIENTS.push(newClient);
    return json({ message: 'Client enrole avec succes', client: newClient });
  }
  if (path === '/clients' && method === 'GET') {
    let filtered = [...MOCK_CLIENTS];
    const search = params.get('search');
    const status = params.get('status');
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => c.lastName.toLowerCase().includes(s) || c.firstName.toLowerCase().includes(s) || c.phone.includes(s) || c.cin.toLowerCase().includes(s));
    }
    if (status && status !== 'Tous') {
      filtered = filtered.filter(c => c.status === status);
    }
    return json(filtered);
  }

  // ── WALLETS ──────────────────────────────────────────────────────────────
  if (path === '/wallets/verify' && method === 'GET') {
    const phone = params.get('phone') || '';
    const wallet = MOCK_WALLETS.find(w => w.phone.includes(phone));
    if (wallet) {
      return json<BeneficiaryVerification>({ name: wallet.ownerName, phone: wallet.phone, type: wallet.type, walletId: wallet.walletId });
    }
    return json({ message: 'Aucun wallet trouve pour ce numero' }, 404);
  }
  if (path.match(/^\/wallets\/\d+\/actions$/) && method === 'POST') {
    const id = parseInt(path.split('/')[2]);
    const wallet = MOCK_WALLETS.find(w => w.id === id);
    const action = (req.body as any)?.action;
    if (wallet) {
      if (action === 'suspend') wallet.status = 'Suspendu';
      if (action === 'reactivate') wallet.status = 'Actif';
      if (action === 'credit') wallet.balance += (req.body as any)?.amount || 0;
      if (action === 'debit') wallet.balance -= (req.body as any)?.amount || 0;
    }
    return json({ message: `Action "${action}" effectuee`, wallet });
  }
  if (path.match(/^\/wallets\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[2]);
    return json(MOCK_WALLETS.find(w => w.id === id) || null);
  }
  if (path.match(/^\/wallets\/\d+$/) && method === 'PUT') {
    const id = parseInt(path.split('/')[2]);
    const wallet = MOCK_WALLETS.find(w => w.id === id);
    if (wallet) Object.assign(wallet, req.body);
    return json({ message: 'Wallet mis a jour', wallet });
  }
  if (path === '/wallets' && method === 'POST') {
    const newWallet: Wallet = { ...req.body as any, id: MOCK_WALLETS.length + 1, walletId: 'W-' + (200000 + MOCK_WALLETS.length), balance: 0, status: 'Actif', transactionFee: 1.5, notes: '' };
    MOCK_WALLETS.push(newWallet);
    return json({ message: 'Wallet cree avec succes', wallet: newWallet });
  }
  if (path === '/wallets' && method === 'GET') {
    let filtered = [...MOCK_WALLETS];
    const search = params.get('search');
    const status = params.get('status');
    const type = params.get('type');
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(w => w.ownerName.toLowerCase().includes(s) || w.phone.includes(s) || w.walletId.toLowerCase().includes(s));
    }
    if (status && status !== 'Tous') filtered = filtered.filter(w => w.status === status);
    if (type && type !== 'Tous') filtered = filtered.filter(w => w.type === type);
    return json(filtered);
  }

  // ── ACCOUNTS ─────────────────────────────────────────────────────────────
  if (path === '/accounts' && method === 'GET') {
    return json<Account[]>(MOCK_ACCOUNTS);
  }

  // ── CASH IN / CASH OUT ───────────────────────────────────────────────────
  if (path === '/transactions/cash-in' && method === 'POST') {
    const txn: TransactionResponse = { transactionId: genId(), status: 'Réussi', message: 'Depot effectue avec succes' };
    return json(txn);
  }
  if (path === '/transactions/cash-out' && method === 'POST') {
    const txn: TransactionResponse = { transactionId: genId(), status: 'Réussi', message: 'Retrait effectue avec succes' };
    return json(txn);
  }

  // ── TRANSFERS ────────────────────────────────────────────────────────────
  if (path === '/transfers' && method === 'POST') {
    const txn: TransactionResponse = { transactionId: genId(), status: 'Réussi', message: 'Transfert effectue avec succes' };
    return json(txn);
  }

  // ── INVOICES / BILL PAYMENTS ─────────────────────────────────────────────
  if (path === '/invoices' && method === 'GET') {
    const billerId = params.get('billerId') || '';
    const billerNames: Record<string, string> = { onee: 'ONEE', lydec: 'LYDEC', redal: 'Redal', 'maroc-telecom': 'Maroc Telecom', orange: 'Orange Maroc', inwi: 'Inwi', canalplus: 'Canal+', wafa: 'Wafa Assurance' };
    const invoice: Invoice = {
      invoiceId: 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      billerName: billerNames[billerId] || billerId,
      customerRef: params.get('customerRef') || '',
      amount: Math.round((150 + Math.random() * 800) * 100) / 100,
      dueDate: '2026-03-01',
      period: 'Janvier 2026'
    };
    return json(invoice);
  }
  if (path === '/payments/bills' && method === 'POST') {
    const txn: TransactionResponse = { transactionId: genId(), status: 'Réussi', message: 'Facture payee avec succes' };
    return json(txn);
  }

  // ── HISTORY (TRANSACTIONS LIST) ──────────────────────────────────────────
  // Map model format to component format
  const typeMap: Record<string, string> = { 'Cash In': 'cash-in', 'Cash Out': 'cash-out', 'Transfert': 'transfer', 'Paiement': 'payment' };
  const statusMap: Record<string, string> = { 'Réussi': 'success', 'En attente': 'pending', 'Échoué': 'failed' };
  const toComponentFormat = (t: Transaction) => {
    const d = new Date(t.date);
    return {
      id: t.id,
      type: typeMap[t.type] || t.type,
      client: t.clientName,
      amount: t.amount,
      date: d.toLocaleDateString('fr-FR'),
      time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: statusMap[t.status] || t.status,
      reference: t.reference,
      description: t.details || '',
      notes: t.details || '',
      fees: t.fees
    };
  };

  if (path.match(/^\/transactions\/[\w-]+$/) && method === 'GET') {
    const id = path.split('/')[2];
    const found = MOCK_TRANSACTIONS.find(t => t.id === id);
    return json(found ? toComponentFormat(found) : null);
  }
  if (path === '/transactions' && method === 'GET') {
    let filtered = [...MOCK_TRANSACTIONS];
    const search = params.get('search');
    const type = params.get('type');
    const status = params.get('status');
    const page = parseInt(params.get('page') || '1');
    const pageSize = parseInt(params.get('pageSize') || '10');

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t => t.clientName.toLowerCase().includes(s) || t.reference.toLowerCase().includes(s) || t.id.toLowerCase().includes(s));
    }
    // Component sends lowercase types (cash-in, cash-out...) — match against mapped values
    if (type && type !== 'all') {
      filtered = filtered.filter(t => typeMap[t.type] === type);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(t => statusMap[t.status] === status);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map(toComponentFormat);

    return json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  }

  // ── Fallback: pass through ───────────────────────────────────────────────
  return next(req);
};
