import { computed, inject, Injectable, signal } from '@angular/core';
import { TransactionsApi } from './transactions.api';
import { mapTransactionListItem } from './transactions.mapper';
import { TransactionListItem } from './transactions.model';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class TransactionsStore {
  private api = inject(TransactionsApi);

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
      .getAll({ page: this.page(), pageSize: this.pageSize() })
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
}
