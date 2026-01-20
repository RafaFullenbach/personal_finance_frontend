import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AccountsStore } from '../../data-access/accounts.store';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../../../core/ui/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
  ],
  providers: [AccountsStore],
  templateUrl: './account-list-page.component.html',
  styleUrl: './account-list-page.component.scss',
})
export class AccountListPageComponent implements OnInit {
  store = inject(AccountsStore);

  private toast = inject(ToastService);

  displayedColumns = ['name', 'type', 'status', 'actions'];

  ngOnInit(): void {
    this.store.load();
  }

  activate(id: string) {
    this.toast.success('Conta ativada com sucesso.');
    this.store.activate(id);
  }

  deactivate(id: string) {
    this.toast.error('Conta desativada com sucesso.');
    this.store.deactivate(id);
  }
}
