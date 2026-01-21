import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export type Guid = string;

export interface BudgetDto {
  id: Guid;
  categoryId: Guid;
  categoryName: string;
  year: number;
  month: number;
  limitAmount: number;
  isActive: boolean;
}

export interface UpsertBudgetRequest {
  categoryId: Guid;
  year: number;
  month: number;
  limitAmount: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class BudgetsApi {
  private http = inject(HttpClient);

  getAll(params: { year: number; month: number }) {
    const hp = new HttpParams()
      .set('year', params.year)
      .set('month', params.month);

    return this.http.get<BudgetDto[]>('/budgets', { params: hp });
  }

  upsert(req: UpsertBudgetRequest) {
    return this.http.put<void>('/budgets', req);
  }

  activate(id: Guid) {
    return this.http.post(`/budgets/${id}/activate`, {});
  }

  deactivate(id: Guid) {
    return this.http.post(`/budgets/${id}/deactivate`, {});
  }

  getById(id: string) {
    return this.http.get<BudgetDto>(`/budgets/${id}`);
  }
}
