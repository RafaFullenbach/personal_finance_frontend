import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export type Guid = string;

export type TransactionType = 'Debit' | 'Credit';

export interface RecurringTemplateListItemDto {
  id: Guid;
  isActive: boolean;
  amount: number;
  type: TransactionType;
  accountId: Guid;
  categoryId?: Guid | null;
  description: string;
  dayOfMonth: number; // 1..31 (ou string no seu swagger, mas trate como number)
  competenceOffsetMonths: number; // ex: 0
  startDate: string; // ISO
  endDate?: string | null; // ISO | null
}

export interface CreateRecurringTemplateRequest {
  amount: number;
  type: TransactionType;
  accountId: Guid;
  categoryId?: Guid | null;
  description: string;
  dayOfMonth: number;
  competenceOffsetMonths: number;
  startDate: string; // ISO
  endDate?: string | null; // ISO | null
}

export type UpdateRecurringTemplateRequest = CreateRecurringTemplateRequest;

@Injectable({ providedIn: 'root' })
export class RecurringApi {
  private http = inject(HttpClient);

  getAll(includeInactive: boolean = true) {
    const params = new HttpParams().set(
      'includeInactive',
      String(includeInactive),
    );
    return this.http.get<RecurringTemplateListItemDto[]>(
      '/recurring/templates',
      { params },
    );
  }

  getById(id: Guid) {
    return this.http.get<RecurringTemplateListItemDto>(`/recurring/templates/${id}`);
  }

  create(req: CreateRecurringTemplateRequest) {
    return this.http.post<void>('/recurring/templates', req);
  }

  update(id: Guid, req: UpdateRecurringTemplateRequest) {
    return this.http.put<void>(`/recurring/templates/${id}`, req);
  }

  activate(id: Guid) {
    return this.http.post<void>(`/recurring/templates/${id}/activate`, {});
  }

  deactivate(id: Guid) {
    return this.http.post<void>(`/recurring/templates/${id}/deactivate`, {});
  }

  generate(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.post<void>('/recurring/generate', {}, { params });
  }
}
