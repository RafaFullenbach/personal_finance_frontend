import { computed, inject, Injectable, signal } from '@angular/core';
import { BudgetsApi, BudgetDto, UpsertBudgetRequest } from './budgets.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class BudgetsStore {
  private api = inject(BudgetsApi);

  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth() + 1);

  readonly items = signal<BudgetDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly vm = computed(() => ({
    year: this.year(),
    month: this.month(),
    items: this.items(),
    loading: this.loading(),
    error: this.error(),
  }));

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll({ year: this.year(), month: this.month() }).subscribe({
      next: (res) => {
        this.items.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  setPeriod(year: number, month: number) {
    this.year.set(year);
    this.month.set(month);
    this.load();
  }

  upsert(req: UpsertBudgetRequest, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.upsert(req).subscribe({
      next: () => {
        this.loading.set(false);
        onSuccess();
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
