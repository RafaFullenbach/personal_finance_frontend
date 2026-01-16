import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Guid = string;

export interface CategoryListItemDto {
  id: Guid;
  name: string;
  type: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriesApi {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<CategoryListItemDto[]>('/categories');
  }
}
