import { Injectable, inject, signal } from '@angular/core';
import { AppError } from '../../../core/error/app-error';
import { CategoriesApi, CategoryListItemDto } from './categories.api';

@Injectable()
export class CategoriesStore {
  private api = inject(CategoriesApi);

  readonly items = signal<CategoryListItemDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

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
}
