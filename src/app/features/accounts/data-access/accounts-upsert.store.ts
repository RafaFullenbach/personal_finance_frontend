import { inject, Injectable, signal } from '@angular/core';
import { AccountsApi, AccountDto, CreateAccountRequest } from './accounts.api';
import { AppError } from '../../../core/error/app-error';
import { AccountsModel } from './accounts.model';

@Injectable()
export class AccountsUpsertStore {
  private api = inject(AccountsApi);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly account = signal<AccountsModel | null>(null);

  load(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getById(id).subscribe({
      next: (res) => {
        this.account.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  create(req: CreateAccountRequest, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.create(req).subscribe({
      next: () => {
        this.loading.set(false);
        onSuccess();
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }

  update(id: string, req: AccountDto, onSuccess: () => void) {
    this.loading.set(true);
    this.error.set(null);

    this.api.update(id, req).subscribe({
      next: () => {
        this.loading.set(false);
        onSuccess();
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }
}
