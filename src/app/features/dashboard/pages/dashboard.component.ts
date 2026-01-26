import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { DashboardStore } from '../data-access/dashboard.store';

import { Chart, registerables, type ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// ✅ registra chart.js + plugin de datalabels
Chart.register(...registerables, ChartDataLabels);

const cssVar = (name: string, el: HTMLElement = document.documentElement) =>
  getComputedStyle(el).getPropertyValue(name).trim();

const positive = cssVar('--pf-data-label');

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [DashboardStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private themeObs?: MutationObserver;

  store = inject(DashboardStore);
  vm = this.store.vm;

  @ViewChild('barCanvas') barCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('expensePieCanvas')
  expensePieCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('incomePieCanvas') incomePieCanvas?: ElementRef<HTMLCanvasElement>;

  private barChart?: Chart<'bar'>;
  private expensePie?: Chart<'pie'>;
  private incomePie?: Chart<'pie'>;

  years = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 5 + i);
  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' },
  ];

  periodForm = this.fb.group({
    year: this.fb.control(new Date().getFullYear(), { nonNullable: true }),
    month: this.fb.control(new Date().getMonth() + 1, { nonNullable: true }),
  });

  constructor() {
    // ✅ re-renderiza quando vm muda (após loadAll)
    effect(() => {
      const v = this.vm();

      // sem canvas ainda / carregando? não renderiza
      if (!this.barCanvas?.nativeElement) return;
      if (v.loading) return;

      this.renderBar(v.chartData, v.chartOptions);
      this.renderExpensePie(v.expensePieData, v.pieOptions);
      this.renderIncomePie(v.incomePieData, v.pieOptions);
    });

    // cleanup
    this.destroyRef.onDestroy(() => {
      this.barChart?.destroy();
      this.expensePie?.destroy();
      this.incomePie?.destroy();
    });
  }

  ngOnInit(): void {
    const y = this.periodForm.controls.year.value;
    const m = this.periodForm.controls.month.value;

    this.store.setPeriod(y, m);
    this.store.loadAll();
  }

  ngAfterViewInit(): void {
    // nada aqui; o effect já cuida quando o canvas existir + vm atualizar
    this.themeObs = new MutationObserver(() => this.applyDataLabelColor());
    this.themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  reload() {
    const y = this.periodForm.controls.year.value;
    const m = this.periodForm.controls.month.value;
    this.store.setPeriod(y, m);
    this.store.loadAll();
  }

  private renderBar(
    data: ChartConfiguration<'bar'>['data'],
    options: ChartConfiguration<'bar'>['options'],
  ) {
    const ctx = this.barCanvas!.nativeElement.getContext('2d')!;
    this.barChart?.destroy();
    this.barChart = new Chart(ctx, { type: 'bar', data, options });
    this.applyDataLabelColor();
  }

  private applyDataLabelColor() {
    const textColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--pf-data-label')
        .trim() || '#fff';

    const brl = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0, // sem centavos
    });

    (this.barChart?.options as any).plugins ??= {};
    (this.barChart?.options as any).plugins.datalabels ??= {};
    (this.barChart?.options as any).plugins.datalabels.color = textColor;

    (this.barChart?.options as any).plugins.datalabels.formatter = (
      value: any,
    ) => {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) return value;
      return brl.format(n); // 135435 -> "R$ 135.435"
    };

    this.barChart?.update();
  }

  private renderExpensePie(
    data: ChartConfiguration<'pie'>['data'],
    options: ChartConfiguration<'pie'>['options'],
  ) {
    const canvas = this.expensePieCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    this.expensePie?.destroy();

    const color = this.getThemeTextColor();

    const mergedOptions: ChartConfiguration<'pie'>['options'] = {
      ...options,
      plugins: {
        ...(options?.plugins ?? {}),

        legend: {
          ...(options?.plugins as any)?.legend,
          labels: {
            ...((options?.plugins as any)?.legend?.labels ?? {}),
            color, // <- "Teste"
          },
        },

        datalabels: {
          ...(options?.plugins as any)?.datalabels,
          formatter: (value: any) => {
            const v = Number(value ?? 0);
            return v >= 5 ? `${v.toFixed(0)}%` : '';
          },
          anchor: 'center',
          align: 'center',
          color, // <- "100%"
          font: { size: 15, weight: 'normal' },
          clamp: true,
        },
      },
    };

    this.expensePie = new Chart(ctx, {
      type: 'pie',
      data,
      options: mergedOptions,
    });

    // opcional: reage a troca de tema
    this.observeThemeChanges(() => {
      const c = this.getThemeTextColor();
      (this.expensePie!.options.plugins as any).legend.labels.color = c;
      (this.expensePie!.options.plugins as any).datalabels.color = c;
      this.expensePie!.update();
    });
  }

  private renderIncomePie(
    data: ChartConfiguration<'pie'>['data'],
    options: ChartConfiguration<'pie'>['options'],
  ) {
    const canvas = this.incomePieCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    this.incomePie?.destroy();

    const color = this.getThemeTextColor();

    const mergedOptions: ChartConfiguration<'pie'>['options'] = {
      ...options,
      plugins: {
        ...(options?.plugins ?? {}),

        legend: {
          ...(options?.plugins as any)?.legend,
          labels: {
            ...((options?.plugins as any)?.legend?.labels ?? {}),
            color,
          },
        },

        datalabels: {
          ...(options?.plugins as any)?.datalabels,
          formatter: (value: any) => {
            const v = Number(value ?? 0);
            return v >= 5 ? `${v.toFixed(0)}%` : '';
          },
          anchor: 'center',
          align: 'center',
          color,
          font: { size: 15, weight: 'normal' },
          clamp: true,
        },
      },
    };

    this.incomePie = new Chart(ctx, {
      type: 'pie',
      data,
      options: mergedOptions,
    });

    // opcional: reage a troca de tema
    this.observeThemeChanges(() => {
      const c = this.getThemeTextColor();
      (this.incomePie!.options.plugins as any).legend.labels.color = c;
      (this.incomePie!.options.plugins as any).datalabels.color = c;
      this.incomePie!.update();
    });
  }

  private getThemeTextColor(): string {
    // dark => branco | light => preto
    return document.documentElement.classList.contains('dark')
      ? '#fff'
      : '#000';
  }

  private observeThemeChanges(onChange: () => void) {
    const el = document.documentElement;

    const obs = new MutationObserver(() => onChange());
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });

    return () => obs.disconnect(); // cleanup
  }
}
