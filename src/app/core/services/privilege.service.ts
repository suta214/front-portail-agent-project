import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AgentType, Privilege } from '../models';

// ── Privilege matrix per agent type ──────────────────────────────────────────
const PRIVILEGE_MATRIX: Record<AgentType, Privilege[]> = {
  ALL: ['CASH_IN', 'CASH_OUT', 'TRANSFER', 'BILL_PAYMENT', 'CLIENT_MGMT', 'WALLET_MGMT', 'HISTORY', 'PROFILE', 'AGENT_MGMT', 'REPORTS'],

  ADMIN: ['CASH_IN', 'CASH_OUT', 'TRANSFER', 'BILL_PAYMENT', 'CLIENT_MGMT', 'WALLET_MGMT', 'HISTORY', 'PROFILE', 'AGENT_MGMT', 'REPORTS'],

  BACK_OFFICE: ['CLIENT_MGMT', 'WALLET_MGMT', 'HISTORY', 'AGENT_MGMT', 'REPORTS', 'PROFILE'],

  AGENT_PROPRE: ['CASH_IN', 'CASH_OUT', 'TRANSFER', 'BILL_PAYMENT', 'CLIENT_MGMT', 'WALLET_MGMT', 'HISTORY', 'REPORTS', 'PROFILE', 'AGENT_MGMT'],

  AGENT_MANDATE_PRINCIPAL: ['CASH_IN', 'CASH_OUT', 'TRANSFER', 'CLIENT_MGMT', 'WALLET_MGMT', 'HISTORY', 'PROFILE'],

  AGENT_MANDATE_COMMERCANT: ['CASH_IN', 'CASH_OUT', 'HISTORY', 'PROFILE'],

  AGENT_MANDATE_DETAILLANT: ['CASH_IN', 'CASH_OUT', 'HISTORY', 'PROFILE'],
};

// ── Agent labels for display ─────────────────────────────────────────────────
const AGENT_LABELS: Record<AgentType, string> = {
  ALL: 'Tous les privilèges',
  ADMIN: 'Administrateur',
  BACK_OFFICE: 'Back Office',
  AGENT_PROPRE: 'Agent Propre',
  AGENT_MANDATE_PRINCIPAL: 'Mandaté Principal',
  AGENT_MANDATE_COMMERCANT: 'Mandaté Commerçant',
  AGENT_MANDATE_DETAILLANT: 'Mandaté Détaillant',
};

// ── Agent descriptions ───────────────────────────────────────────────────────
const AGENT_DESCRIPTIONS: Record<AgentType, string> = {
  ALL: 'Accès complet à toutes les fonctionnalités du portail',
  ADMIN: 'Créer/modifier/supprimer tous les agents, accès complet, configuration du portail',
  BACK_OFFICE: 'Support administratif, validation transactions, rapports, gestion utilisateurs BO',
  AGENT_PROPRE: 'Employé interne HPS — Cash In/Out, transferts, factures, gestion clients/wallets, créer agents',
  AGENT_MANDATE_PRINCIPAL: 'Superviseur régional — Cash In/Out, transferts, gestion clients/wallets, supervise commerçants',
  AGENT_MANDATE_COMMERCANT: 'Point de vente — Cash In/Out pour clients, historique propre',
  AGENT_MANDATE_DETAILLANT: 'Niveau détail — Cash In/Out uniquement pour clients',
};

@Injectable({ providedIn: 'root' })
export class PrivilegeService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly AGENT_TYPE_KEY = 'agent_type';
  private readonly PRIVILEGES_KEY = 'agent_privileges';

  private agentTypeSubject = new BehaviorSubject<AgentType>(this.getSavedAgentType());
  private privilegesSubject = new BehaviorSubject<Privilege[]>(this.getSavedPrivileges());

  agentType$ = this.agentTypeSubject.asObservable();
  privileges$ = this.privilegesSubject.asObservable();

  get currentAgentType(): AgentType { return this.agentTypeSubject.value; }
  get currentPrivileges(): Privilege[] { return this.privilegesSubject.value; }

  private getSavedAgentType(): AgentType {
    if (!this.isBrowser) return 'ALL';
    return (localStorage.getItem(this.AGENT_TYPE_KEY) as AgentType) || 'ALL';
  }

  private getSavedPrivileges(): Privilege[] {
    if (!this.isBrowser) return PRIVILEGE_MATRIX['ALL'];
    const saved = localStorage.getItem(this.PRIVILEGES_KEY);
    return saved ? JSON.parse(saved) : PRIVILEGE_MATRIX['ALL'];
  }

  /** All available agent types */
  getAgentTypes(): AgentType[] {
    return Object.keys(PRIVILEGE_MATRIX) as AgentType[];
  }

  /** Get display label for an agent type */
  getLabel(type: AgentType): string {
    return AGENT_LABELS[type] || type;
  }

  /** Get description for an agent type */
  getDescription(type: AgentType): string {
    return AGENT_DESCRIPTIONS[type] || '';
  }

  /** Get privileges for a given agent type */
  getPrivilegesFor(type: AgentType): Privilege[] {
    return PRIVILEGE_MATRIX[type] || [];
  }

  /** Called after login — sets type and privileges from the backend response */
  setFromLogin(agentType: AgentType, privileges: Privilege[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.AGENT_TYPE_KEY, agentType);
      localStorage.setItem(this.PRIVILEGES_KEY, JSON.stringify(privileges));
    }
    this.agentTypeSubject.next(agentType);
    this.privilegesSubject.next(privileges);
  }

  /** Called on logout — resets to defaults */
  reset(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.AGENT_TYPE_KEY);
      localStorage.removeItem(this.PRIVILEGES_KEY);
    }
    this.agentTypeSubject.next('AGENT_PROPRE');
    this.privilegesSubject.next([]);
  }

  /** Check if current agent has a specific privilege */
  has(privilege: Privilege): boolean {
    return this.currentPrivileges.includes(privilege);
  }

  /** Check if current agent is an administrator (ADMIN or ALL) */
  isAdmin(): boolean {
    return this.currentAgentType === 'ADMIN' || this.currentAgentType === 'ALL';
  }
}
