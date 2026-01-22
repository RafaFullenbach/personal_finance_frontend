// src/app/features/dashboard/data-access/dashboard.store.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ReportsApi,
  BalanceDto,
  MonthlySummaryDto,
  CategorySummaryItemDto,
} from './reports.api';
import { AppError } from '../../../core/error/app-error';

import type { ChartConfiguration } from 'chart.js';

function monthLabelPt(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1, 1);
  d.setMonth(d.getMonth() + delta);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

@Injectable()
export class DashboardStore {
  private api = inject(ReportsApi);

  readonly year = signal<number>(new Date().getFullYear());
  readonly month = signal<number>(new Date().getMonth() + 1);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly balance = signal<BalanceDto | null>(null);
  readonly monthly = signal<MonthlySummaryDto | null>(null);

  // novos dados (pizzas)
  readonly expenseCats = signal<CategorySummaryItemDto[]>([]);
  readonly incomeCats = signal<CategorySummaryItemDto[]>([]);

  // bar chart
  readonly chartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [],
  });

  readonly chartOptions = signal<ChartConfiguration<'bar'>['options']>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
  });

  // pie charts (data)
  readonly expensePieData = signal<ChartConfiguration<'pie'>['data']>({
    labels: [],
    datasets: [],
  });

  readonly incomePieData = signal<ChartConfiguration<'pie'>['data']>({
    labels: [],
    datasets: [],
  });

  readonly pieOptions = signal<ChartConfiguration<'pie'>['options']>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true },
    },
  });

  readonly vm = computed(() => ({
    loading: this.loading(),
    error: this.error(),
    balance: this.balance(),
    monthly: this.monthly(),
    monthLabel: monthLabelPt(this.year(), this.month()),

    chartData: this.chartData(),
    chartOptions: this.chartOptions(),

    expensePieData: this.expensePieData(),
    incomePieData: this.incomePieData(),
    pieOptions: this.pieOptions(),

    expenseCats: this.expenseCats(),
    incomeCats: this.incomeCats(),
  }));

  setPeriod(year: number, month: number) {
    this.year.set(year);
    this.month.set(month);
  }

  loadAll() {
    this.loading.set(true);
    this.error.set(null);

    const y = this.year();
    const m = this.month();
    const todayIso = new Date().toISOString();

    const last6 = Array.from({ length: 6 }, (_, i) =>
      addMonths(y, m, -(5 - i)),
    );

    forkJoin({
      balance: this.api.balance(todayIso),
      monthly: this.api.monthlySummary(y, m),
      // barras (6 meses)
      series: forkJoin(
        last6.map((p) => this.api.monthlySummary(p.year, p.month)),
      ),

      // pizzas
      expense: this.api.categorySummary(y, m, 'Expense'),
      income: this.api.categorySummary(y, m, 'Income'),
    })
      .pipe(
        catchError((e) => {
          this.error.set(e);
          this.loading.set(false);
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (!res) return;

        this.balance.set(res.balance);
        this.monthly.set(res.monthly);

        // ===== bar chart =====
        const labels = last6.map((p) => monthLabelPt(p.year, p.month));
        const credits = res.series.map((s) => s.totalCredits);
        const debits = res.series.map((s) => s.totalDebits);

        this.chartData.set({
          labels,
          datasets: [
            { label: 'Receitas', data: credits },
            { label: 'Despesas', data: debits },
          ],
        });

        // ===== pizzas =====
        this.expenseCats.set(res.expense ?? []);
        this.incomeCats.set(res.income ?? []);

        this.expensePieData.set({
          labels: (res.expense ?? []).map((x) => x.categoryName),
          datasets: [
            {
              // melhor usar totalAmount do que percentage (tooltip fica mais útil)
              label: 'Despesas',
              data: (res.expense ?? []).map((x) => x.percentage),
            },
          ],
        });

        this.incomePieData.set({
          labels: (res.income ?? []).map((x) => x.categoryName),
          datasets: [
            {
              label: 'Receitas',
              data: (res.income ?? []).map((x) => x.percentage),
            },
          ],
        });

        this.loading.set(false);
      });
  }
}
