import { inject, Injectable, signal } from '@angular/core';
import {
  CategoriesApi,
  CategoryListItemDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './categories.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class CategoriesUpsertStore {
  private api = inject(CategoriesApi);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);
  readonly item = signal<CategoryListItemDto | null>(null);

  load(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getById(id).subscribe({
      next: (res) => {
        this.item.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  create(req: CreateCategoryRequest, onSuccess: () => void) {
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

  update(id: string, req: UpdateCategoryRequest, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.update(id, req).subscribe({
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
