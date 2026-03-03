// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  agentId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  agentId: string;
  agentName: string;
  agentCode: string;
  agentType: string;
  privileges: string[];
  features: string[];
  mustChangePassword: boolean;
}

export type AgentType = 'ALL' | 'ADMIN' | 'BACK_OFFICE' | 'AGENT_PROPRE' | 'AGENT_MANDATE_PRINCIPAL' | 'AGENT_MANDATE_COMMERCANT' | 'AGENT_MANDATE_DETAILLANT';

export type Privilege = 'CASH_IN' | 'CASH_OUT' | 'TRANSFER' | 'BILL_PAYMENT' | 'CLIENT_MGMT' | 'WALLET_MGMT' | 'HISTORY' | 'PROFILE' | 'AGENT_MGMT' | 'REPORTS';

// ── Agent / Profile ───────────────────────────────────────────────────────────
export interface AgentProfile {
  id: number;
  agentId: string;
  agentCode: string;
  fullName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  balance: number;
  commissionBalance: number;
  todayTransactionsCount: number;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileSettingsRequest {
  language?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
  twoFactorEnabled?: boolean;
}

// ── Client ────────────────────────────────────────────────────────────────────
export interface Client {
  id: number;
  lastName: string;
  firstName: string;
  cin: string;
  phone: string;
  email: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  address: string;
  city: string;
  walletId: string;
  balance: number;
  status: 'Actif' | 'Suspendu' | 'KYC Incomplet';
  kycVerified: boolean;
  idType: string;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
}

export interface ClientEnrollRequest {
  lastName: string;
  firstName: string;
  cin: string;
  phone: string;
  email: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  address: string;
  city: string;
  idType: string;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
}

export interface ClientSearchParams {
  search?: string;
  status?: string;
}

// ── Wallet ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  identifiant: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  commission: string;
  rib: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  agentType: AgentType;
  privileges: Privilege[];
  contractType?: string;
  contractDate?: string;
  signatory?: string;
  patentNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  country?: string;
  region?: string;
  city?: string;
  postalCode?: string;
}

export interface Wallet {
  id: number;
  walletId: string;
  ownerName: string;
  phone: string;
  email: string;
  type: 'Niveau 1' | 'Niveau 2' | 'Niveau 3';
  status: 'Actif' | 'Suspendu' | 'Fermé';
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
  transactionFee: number;
  currency: string;
  kycVerified: boolean;
  notes: string;
}

export interface CreateWalletRequest {
  ownerName: string;
  phone: string;
  email: string;
  type: string;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
  kycVerified: boolean;
}

export interface WalletAction {
  action: 'suspend' | 'reactivate' | 'close' | 'credit' | 'debit';
  amount?: number;
  reason: string;
}

export interface WalletSearchParams {
  search?: string;
  status?: string;
  type?: string;
}

// ── Account ───────────────────────────────────────────────────────────────────
export interface Account {
  rib: string;
  accountId: string;
  accountType: string;
  balance: number;
}

// ── Transaction (Cash In / Cash Out) ──────────────────────────────────────────
export interface CashInRequest {
  accountId: string;
  cardNumber?: string;
  amount: number;
  fees: number;
  clientPhone: string;
}

export interface CashOutRequest {
  accountId: string;
  cardNumber?: string;
  amount: number;
  fees: number;
  clientPhone: string;
}

export interface TransactionResponse {
  transactionId: string;
  status: string;
  message: string;
}

// ── Transfer ──────────────────────────────────────────────────────────────────
export interface TransferRequest {
  transferType: string;
  senderPhone: string;
  beneficiaryPhone: string;
  amount: number;
  fees: number;
  reason: string;
}

export interface BeneficiaryVerification {
  name: string;
  phone: string;
  type: string;
  walletId: string;
}

// ── Bill Payment ──────────────────────────────────────────────────────────────
export interface Biller {
  id: string;
  name: string;
  icon: string;
}

export interface Invoice {
  invoiceId: string;
  billerName: string;
  customerRef: string;
  amount: number;
  dueDate: string;
  period: string;
}

export interface BillPaymentRequest {
  billerId: string;
  customerRef: string;
  contractNumber: string;
  amount: number;
  fees: number;
}

// ── History ───────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  type: 'Cash In' | 'Cash Out' | 'Transfert' | 'Paiement';
  clientName: string;
  amount: number;
  date: string;
  status: 'Réussi' | 'En attente' | 'Échoué';
  reference: string;
  fees: number;
  agentId: string;
  details?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: string;
  status?: string;
  dateRange?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Agent Creation ───────────────────────────────────────────────────────────
export interface AgentFeature {
  key: string;
  label: string;
}

export interface CreateAgentRequest {
  identifiant: string;
  commission: string;
  firstName: string;
  lastName: string;
  agentType: string;
  idType: string;
  idNumber: string;
  email: string;
  emailConfirmation: string;
  phone: string;
  otpChannel?: 'EMAIL' | 'SMS';
  contractType: string;
  patentNumber: string;
  contractDate: string;
  signatory: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  features: string[];
}

export interface CreatedAgent {
  id: number;
  identifiant: string;
  firstName: string;
  lastName: string;
  agentType: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  otpChannel?: 'EMAIL' | 'SMS';
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  agentBalance: number;
  commissionBalance: number;
  todayTransactionsCount: number;
  agentName: string;
  agentCode: string;
  // Transactions du jour (agents opérationnels)
  todayCashInCount?: number;
  todayCashInAmount?: number;
  todayCashOutCount?: number;
  todayCashOutAmount?: number;
  todayTransfersCount?: number;
  todayBillPaymentsCount?: number;
  // Gestion (Back Office)
  activeClients?: number;
  totalWallets?: number;
  pendingTransactions?: number;
  // Admin global
  totalAgents?: number;
  totalVolume?: number;
  globalBalance?: number;
}
