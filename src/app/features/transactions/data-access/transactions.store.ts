import { computed, inject, Injectable, signal } from '@angular/core';
import {
  TransactionsApi,
  TransactionStatus,
  TransactionType,
} from './transactions.api';
import { mapTransactionListItem } from './transactions.mapper';
import { TransactionListItem } from './transactions.model';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class TransactionsStore {
  private api = inject(TransactionsApi);

  readonly filterYear = signal<number | null>(null);
  readonly filterMonth = signal<number | null>(null);
  readonly filterType = signal<TransactionType | null>(null);
  readonly filterStatus = signal<TransactionStatus | null>(null);
  readonly sortBy = signal<string>('transactionDate');
  readonly order = signal<'asc' | 'desc'>('desc');
  readonly items = signal<TransactionListItem[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(20);
  readonly totalItems = signal(0);
  readonly totalPages = signal(0);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly vm = computed(() => ({
    items: this.items(),
    page: this.page(),
    pageSize: this.pageSize(),
    totalItems: this.totalItems(),
    totalPages: this.totalPages(),
    loading: this.loading(),
    error: this.error(),
  }));

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .getAll({
        page: this.page(),
        pageSize: this.pageSize(),
        year: this.filterYear() ?? undefined,
        month: this.filterMonth() ?? undefined,
        type: this.filterType() ?? undefined,
        status: this.filterStatus() ?? undefined,
        sortBy: this.sortBy(),
        order: this.order(),
      })
      .subscribe({
        next: (res) => {
          this.items.set(res.items.map(mapTransactionListItem));
          this.page.set(res.page);
          this.pageSize.set(res.pageSize);
          this.totalItems.set(res.totalItems);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e);
          this.loading.set(false);
        },
      });
  }

  setPage(page: number, pageSize: number) {
    this.page.set(page);
    this.pageSize.set(pageSize);
    this.load();
  }

  confirm(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.confirm(id).subscribe({
      next: () => this.load(),
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  cancel(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.cancel(id).subscribe({
      next: () => this.load(),
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  setFilters(f: {
    year: number | null;
    month: number | null;
    type: string | null;
    status: string | null;
  }) {
    this.filterYear.set(f.year);
    this.filterMonth.set(f.month);
    this.filterType.set(f.type as any);
    this.filterStatus.set(f.status as any);
    this.page.set(1);
    this.load();
  }

  clearFilters() {
    this.filterYear.set(null);
    this.filterMonth.set(null);
    this.filterType.set(null);
    this.filterStatus.set(null);
    this.page.set(1);
    this.load();
  }

  setSort(sortBy: string, order: 'asc' | 'desc') {
    this.sortBy.set(sortBy);
    this.order.set(order);
    this.page.set(1);
    this.load();
  }
}
