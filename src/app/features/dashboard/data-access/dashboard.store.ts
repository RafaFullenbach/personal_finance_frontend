import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ReportsApi,
  BalanceDto,
  BudgetVsActualItemDto,
  MonthlySummaryDto,
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

  // período do dashboard
  readonly year = signal<number>(new Date().getFullYear());
  readonly month = signal<number>(new Date().getMonth() + 1);

  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

  readonly balance = signal<BalanceDto | null>(null);
  readonly monthly = signal<MonthlySummaryDto | null>(null);

  // ✅ deixa, mas NÃO carrega no loadAll
  readonly budgetVsActual = signal<BudgetVsActualItemDto[]>([]);

  // chart
  readonly chartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [],
  });

  readonly chartOptions = signal<ChartConfiguration<'bar'>['options']>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } } },
    },
  });

  readonly vm = computed(() => ({
    loading: this.loading(),
    error: this.error(),
    balance: this.balance(),
    monthly: this.monthly(),
    // continua exposto caso você queira usar em outra tela
    budgetVsActual: this.budgetVsActual(),
    chartData: this.chartData(),
    chartOptions: this.chartOptions(),
    monthLabel: monthLabelPt(this.year(), this.month()),
  }));

  setPeriod(year: number, month: number) {
    this.year.set(year);
    this.month.set(month);
  }

  /**
   * ✅ Dashboard leve:
   * - balance (até hoje)
   * - monthly summary (mês selecionado)
   * - série últimos 6 meses (para o gráfico)
   *
   * ❌ NÃO carrega budget-vs-actual
   */
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
      series: forkJoin(
        last6.map((p) => this.api.monthlySummary(p.year, p.month)),
      ),
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

        this.loading.set(false);
      });
  }

  /**
   * ✅ Carrega Budget vs Actual sob demanda (para outra tela)
   */
  loadBudgetVsActual() {
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
          return of(null);
        }),
      )
      .subscribe((items) => {
        if (!items) return;
        this.budgetVsActual.set(items);
        this.loading.set(false);
      });
  }

  /**
   * Opcional: se você quiser garantir que não fica dado “velho”
   */
  clearBudgetVsActual() {
    this.budgetVsActual.set([]);
  }
}
