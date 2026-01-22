import { computed, inject, Injectable, signal } from '@angular/core';
import { TransfersApi, CreateTransferRequest } from './transfers.api';
import { AppError } from '../../../core/error/app-error';

@Injectable()
export class TransfersCreateStore {
  private api = inject(TransfersApi);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly vm = computed(() => ({
    loading: this.loading(),
    error: this.error(),
  }));

  create(req: CreateTransferRequest, onSuccess: () => void) {
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
