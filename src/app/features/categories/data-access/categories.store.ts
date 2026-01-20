import { computed, inject, Injectable, signal } from '@angular/core';
import { CategoriesApi, CategoryListItemDto } from './categories.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class CategoriesStore {
  private api = inject(CategoriesApi);

  readonly items = signal<CategoryListItemDto[]>([]);
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
