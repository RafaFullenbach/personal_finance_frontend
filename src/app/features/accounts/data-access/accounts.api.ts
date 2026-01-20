import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsModel } from './accounts.model';

export type AccountType = 'Cash' | 'Bank' | 'CreditCard' | 'Investment';

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
}

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<AccountsModel[]>('/accounts');
  }

  activate(id: string) {
    return this.http.post(`/accounts/${id}/activate`, {});
  }

  deactivate(id: string) {
    return this.http.post(`/accounts/${id}/deactivate`, {});
  }

  create(req: CreateAccountRequest) {
    return this.http.post<void>('/accounts', req);
  }
}
