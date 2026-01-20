import { computed, inject, Injectable, signal } from '@angular/core';
import { AccountsApi } from './accounts.api';
import { mapAccountListItem } from './accounts.mapper';
import { AccountsModel } from './accounts.model';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class AccountsStore {
  private api = inject(AccountsApi);

  readonly items = signal<AccountsModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly vm = computed(() => ({
    items: this.items(),
    loading: this.loading(),
    error: this.error(),
  }));

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (res) => {
        this.items.set(res.map(mapAccountListItem));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  activate(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.activate(id).subscribe({
      next: () => this.load(),
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  deactivate(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.deactivate(id).subscribe({
      next: () => this.load(),
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }
}
