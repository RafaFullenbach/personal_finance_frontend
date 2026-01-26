import { computed, inject, Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '../../../core/error/app-error';
import {
  BudgetVsActualItemDto,
  ReportsApi,
} from '../../dashboard/data-access/reports.api';

@Injectable()
export class BudgetVsActualStore {
  private api = inject(ReportsApi);

  readonly year = signal<number>(new Date().getFullYear());
  readonly month = signal<number>(new Date().getMonth() + 1);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);
  readonly items = signal<BudgetVsActualItemDto[]>([]);

  readonly vm = computed(() => ({
    year: this.year(),
    month: this.month(),
    loading: this.loading(),
    error: this.error(),
    items: this.items(),
  }));

  setPeriod(year: number, month: number) {
    this.year.set(year);
    this.month.set(month);
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    const y = this.year();
    const m = this.month();

    this.api
      .budgetVsActual(y, m)
      .pipe(
        catchError((e) => {
          this.error.set(e);
          this.loading.set(false);
          return of([] as BudgetVsActualItemDto[]);
        }),
      )
      .subscribe((items) => {
        this.items.set(items);
        this.loading.set(false);
      });
  }
}
