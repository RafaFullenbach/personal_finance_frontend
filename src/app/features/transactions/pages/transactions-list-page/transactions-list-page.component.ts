import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TransactionsStore } from '../../data-access/transactions.store';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../../../core/ui/toast.service';

@Component({
  selector: 'app-transactions-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  providers: [TransactionsStore],
  templateUrl: './transactions-list-page.component.html',
  styleUrl: './transactions-list-page.component.scss',
})
export class TransactionsListPageComponent implements OnInit {
  store = inject(TransactionsStore);

  private fb = inject(FormBuilder);
  
  private toast = inject(ToastService);
  
  years = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 5 + i);

  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' },
  ];

  types = [
    { value: 'Debit', label: 'Despesa' },
    { value: 'Credit', label: 'Receita' },
  ];

  statuses = [
    { value: 'Pending', label: 'Pendente' },
    { value: 'Confirmed', label: 'Confirmado' },
    { value: 'Cancelled', label: 'Cancelado' },
  ];

  filtersForm = this.fb.group({
    year: this.fb.control<number | null>(null),
    month: this.fb.control<number | null>(null),
    type: this.fb.control<string | null>(null),
    status: this.fb.control<string | null>(null),
  });

  displayedColumns: string[] = [
    'transactionDate',
    'description',
    'amount',
    'type',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.store.load();
  }

  onPage(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1, e.pageSize);
  }

  applyFilters() {
    const v = this.filtersForm.value;

    this.store.setFilters({
      year: v.year ?? null,
      month: v.month ?? null,
      type: v.type ?? null,
      status: v.status ?? null,
    });
  }

  clearFilters() {
    this.filtersForm.reset();
    this.store.clearFilters();
  }

  confirm(id: string) {
    this.toast.success('Lançamento confirmado com sucesso.');
    this.store.confirm(id);
  }

  cancel(id: string) {
    this.toast.success('Lançamento cancelado com sucesso.');
    this.store.cancel(id);
  }
}
