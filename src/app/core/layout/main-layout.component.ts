import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { AuthService } from '../services/auth.service';
import { PrivilegeService } from '../services/privilege.service';
import { Privilege } from '../models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  agentName = 'Agent';
  agentCode = 'AP-000';
  agentId = '';
  showDropdown = false;

  constructor(
    public ts: TranslationService,
    private authService: AuthService,
    public ps: PrivilegeService,
  ) {}

  ngOnInit() {
    const info = this.authService.getAgentInfo();
    if (info) {
      this.agentName = info.agentId || 'Agent';
      this.agentCode = info.agentCode || 'AP-000';
      this.agentId = info.agentId || '';
    }
  }

  get initials(): string {
    return this.agentName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'AP';
  }

  has(privilege: Privilege): boolean {
    return this.ps.has(privilege);
  }

  isAdmin(): boolean {
    return this.ps.isAdmin();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
  }
}
