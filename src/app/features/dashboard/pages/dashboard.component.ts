import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { Chart } from 'chart.js/auto';

import { DashboardStore } from '../data-access/dashboard.store';
import { BudgetStatus } from '../data-access/reports.api';

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
    MatTableModule,
  ],
  providers: [DashboardStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  store = inject(DashboardStore);

  @ViewChild('chartCanvas')
  private chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart<'bar'> | null = null;
  private canvasReady = signal(false);

  // período
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
    year: this.fb.control(this.store.year()),
    month: this.fb.control(this.store.month()),
  });

  // vm local (só pra facilitar no template)
  vm = this.store.vm;

  constructor() {
    // sempre que o form mudar, você pode manter os signals sincronizados (opcional)
    this.periodForm.valueChanges.subscribe((v) => {
      if (!v.year || !v.month) return;
      this.store.setPeriod(v.year, v.month);
    });

    // re-render do chart quando chartData / chartOptions mudarem
    effect(() => {
      if (!this.canvasReady()) return;

      const data = this.store.chartData();
      const options = this.store.chartOptions();

      if (!this.chart) {
        this.chart = new Chart(this.chartCanvas.nativeElement, {
          type: 'bar',
          data,
          options,
        });
        return;
      }

      this.chart.data = data;
      this.chart.options = options ?? {};
      this.chart.update();
    });
  }

  ngAfterViewInit(): void {
    this.canvasReady.set(true);

    // carrega tudo uma vez ao entrar
    this.store.loadAll();
  }

  reload(): void {
    const v = this.periodForm.getRawValue();
    this.store.setPeriod(v.year!, v.month!);
    this.store.loadAll();
  }
}
