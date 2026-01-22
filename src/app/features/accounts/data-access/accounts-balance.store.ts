import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  ReportsApi,
  AccountBalanceDto,
} from '../../dashboard/data-access/reports.api'; // ajuste o path
import { AccountListItemDto, AccountsApi } from '../data-access/accounts.api'; // ajuste o path
import { AppError } from '../../../core/error/app-error';

export type AccountBalanceCardVm = {
  accountId: string;
  accountName: string;
  date: string;
  totalCredits: number;
  totalDebits: number;
  balance: number;
  transactionsCount: number;
};

@Injectable()
export class AccountsBalanceStore {
  private reportsApi = inject(ReportsApi);
  private accountsApi = inject(AccountsApi);

  readonly date = signal<Date>(new Date());

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly items = signal<AccountBalanceCardVm[]>([]);

  readonly vm = computed(() => ({
    date: this.date(),
    loading: this.loading(),
    error: this.error(),
    items: this.items(),
  }));

  setDate(d: Date) {
    this.date.set(d);
  }

  loadAll() {
    this.loading.set(true);
    this.error.set(null);

    const dateIso = this.date().toISOString();

    this.accountsApi
      .getAll()
      .pipe(
        switchMap((accounts: AccountListItemDto[]) => {
          if (!accounts.length) return of([] as AccountBalanceCardVm[]);

          const calls = accounts.map((a) =>
            this.reportsApi.accountBalance(a.id, dateIso).pipe(
              map((res: AccountBalanceDto) => ({
                accountId: a.id,
                accountName: a.name,
                date: res.date,
                totalCredits: res.totalCredits,
                totalDebits: res.totalDebits,
                balance: res.balance,
                transactionsCount: res.transactionsCount,
              })),
              // se uma conta falhar, não derruba a página inteira
              catchError(() => of(null)),
            ),
          );

          return forkJoin(calls).pipe(
            map((rows) =>
              rows
                .filter((x): x is AccountBalanceCardVm => x !== null)
                // opcional: ordena por saldo desc
                .sort((a, b) => (b.balance ?? 0) - (a.balance ?? 0)),
            ),
          );
        }),
        catchError((e) => {
          this.error.set(e);
          return of(null);
        }),
      )
      .subscribe((rows) => {
        if (rows) this.items.set(rows);
        this.loading.set(false);
      });
  }
}
