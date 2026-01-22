import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsModel } from './accounts.model';

export type AccountType = 'Cash' | 'Bank' | 'CreditCard' | 'Investment';

export type Guid = string;

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
}

export interface AccountDto {
  name: string;
  type: AccountType;
}

export interface AccountResponse {
  id: Guid;
  isActive: boolean;
}

export interface AccountListItemDto {
  id: Guid;
  name: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<AccountsModel[]>('/accounts');
  }

  activate(id: Guid) {
    return this.http.post(`/accounts/${id}/activate`, {});
  }

  deactivate(id: Guid) {
    return this.http.post(`/accounts/${id}/deactivate`, {});
  }

  create(req: CreateAccountRequest) {
    return this.http.post<void>('/accounts', req);
  }

  getById(id: Guid) {
    return this.http.get<AccountsModel>(`/accounts/${id}`);
  }

  update(id: Guid, req: AccountDto) {
    return this.http.put<AccountResponse>(`/accounts/${id}`, req);
  }
}
