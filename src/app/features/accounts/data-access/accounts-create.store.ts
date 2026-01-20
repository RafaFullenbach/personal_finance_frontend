import { inject, Injectable, signal } from '@angular/core';
import { AccountsApi, CreateAccountRequest } from './accounts.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class AccountsCreateStore {
  private api = inject(AccountsApi);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

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
}
