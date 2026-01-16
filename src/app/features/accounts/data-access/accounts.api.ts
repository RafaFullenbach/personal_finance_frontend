import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Guid = string;

export interface AccountListItemDto {
  id: Guid;
  name: string;
  type: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<AccountListItemDto[]>('/accounts');
  }
}
