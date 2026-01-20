import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

export type Guid = string;

// ajuste conforme seu backend: Expense/Income, Debit/Credit, etc
export type CategoryType = 'Expense' | 'Income';

export interface CategoryListItemDto {
  id: Guid;
  name: string;
  type: CategoryType;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest {
  name: string;
  type: CategoryType;
}

@Injectable({ providedIn: 'root' })
export class CategoriesApi {
  private http = inject(HttpClient);

  getAll(indludeInactive: boolean = true) {
    const params = new HttpParams().set(
      'includeInactive',
      String(indludeInactive),
    );
    return this.http.get<CategoryListItemDto[]>('/categories', { params });
  }

  getById(id: Guid) {
    return this.http.get<CategoryListItemDto>(`/categories/${id}`);
  }

  create(req: CreateCategoryRequest) {
    return this.http.post<void>('/categories', req);
  }

  update(id: Guid, req: UpdateCategoryRequest) {
    return this.http.put<void>(`/categories/${id}`, req);
  }

  activate(id: Guid) {
    return this.http.post(`/categories/${id}/activate`, {});
  }

  deactivate(id: Guid) {
    return this.http.post(`/categories/${id}/deactivate`, {});
  }
}
