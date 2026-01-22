import { Injectable, inject, signal } from '@angular/core';
import { MonthsApi } from './months.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class MonthCloseStore {
  private api = inject(MonthsApi);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  close(
    year: number,
    month: number,
    autoConfirmPending: boolean,
    onSuccess?: () => void,
  ) {
    this.loading.set(true);
    this.error.set(null);

    this.api.closeMonth(year, month, autoConfirmPending).subscribe({
      next: () => {
        this.loading.set(false);
        onSuccess?.();
      },
      error: (e) => {
        this.error.set(e);
        this.loading.set(false);
      },
    });
  }
}
