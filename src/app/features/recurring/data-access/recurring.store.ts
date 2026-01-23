import { computed, inject, Injectable, signal } from '@angular/core';
import {
  RecurringApi,
  CreateRecurringTemplateRequest,
  RecurringTemplateListItemDto,
} from './recurring.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class RecurringStore {
  private api = inject(RecurringApi);

  readonly items = signal<RecurringTemplateListItemDto[]>([]);
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
        this.items.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  create(req: CreateRecurringTemplateRequest, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.create(req).subscribe({
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

  generate(year: number, month: number, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.generate(year, month).subscribe({
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
}
