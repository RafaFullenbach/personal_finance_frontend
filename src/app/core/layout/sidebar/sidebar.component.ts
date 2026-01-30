import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

type NavItem = { label: string; icon: string; path: string };

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  version = environment.version;

  nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Lançamentos', icon: 'receipt_long', path: '/transactions' },
    { label: 'Contas', icon: 'account_balance', path: '/accounts' },
    { label: 'Categorias', icon: 'category', path: '/categories' },
    { label: 'Orçamentos', icon: 'pie_chart', path: '/budgets' },
    { label: 'Recorrência', icon: 'repeat', path: '/recurring' },
    { label: 'Fechamento', icon: 'event_available', path: '/months' },
    { label: 'Transferências', icon: 'swap_horiz', path: '/transfers' },
  ];
}
