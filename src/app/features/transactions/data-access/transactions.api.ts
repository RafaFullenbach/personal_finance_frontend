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

@Injectable({ providedIn: 'root' })
export class TransactionsApi {
  private http = inject(HttpClient);

  getAll(params: {
    page: number;
    pageSize: number;
  }): Observable<PagedResult<TransactionListItemDto>> {
    const hp = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);

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
}
