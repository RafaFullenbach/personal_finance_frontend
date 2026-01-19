import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsModel } from './accounts.model';

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<AccountsModel[]>('/accounts');
  }
}
