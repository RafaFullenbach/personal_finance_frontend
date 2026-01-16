import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Guid = string;
export type TransactionType = 'Debit' | 'Credit';
export type TransactionStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface TransactionListItemDto {
  id: Guid;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  competenceYear: number;
  competenceMonth: number;
  description: string;
  accountId: Guid;
  recurringTemplateId?: Guid | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateTransactionRequest {
  amount: number;
  type: TransactionType;
  transactionDate: string; // ISO
  competenceYear: number;
  competenceMonth: number;
  description: string;
  accountId: Guid;
  categoryId?: Guid | null;
  recurringTemplateId?: Guid | null;
}

@Injectable({ providedIn: 'root' })
export class TransactionsApi {
  private http = inject(HttpClient);

  getAll(params: {
    page: number;
    pageSize: number;
    year?: number;
    month?: number;
    type?: TransactionType;
    status?: TransactionStatus;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    let hp = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);

    if (params.year != null) hp = hp.set('year', params.year);
    if (params.month != null) hp = hp.set('month', params.month);
    if (params.type) hp = hp.set('type', params.type);
    if (params.status) hp = hp.set('status', params.status);

    hp = hp.set('sortBy', params.sortBy ?? 'transactionDate');
    hp = hp.set('order', params.order ?? 'desc');

    return this.http.get<PagedResult<TransactionListItemDto>>('/transactions', {
      params: hp,
    });
  }

  confirm(id: Guid) {
    return this.http.post<void>(`/transactions/${id}/confirm`, {});
  }

  cancel(id: Guid) {
    return this.http.post<void>(`/transactions/${id}/cancel`, {});
  }

  create(body: CreateTransactionRequest) {
    return this.http.post<void>('/transactions', body);
  }
}
