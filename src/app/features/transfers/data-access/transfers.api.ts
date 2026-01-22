import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Guid = string;

export interface CreateTransferRequest {
  fromAccountId: Guid;
  toAccountId: Guid;
  amount: number;
  transactionDate: string; // ISO
  competenceYear: number;
  competenceMonth: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class TransfersApi {
  private http = inject(HttpClient);

  create(req: CreateTransferRequest): Observable<void> {
    return this.http.post<void>('/transfers', req);
  }
}
