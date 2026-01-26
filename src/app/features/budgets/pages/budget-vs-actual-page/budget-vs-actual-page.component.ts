import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BudgetVsActualStore } from '../../data-access/budget-vs-actual.store';
import { BudgetStatus } from '../../../dashboard/data-access/reports.api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-budget-vs-actual-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [BudgetVsActualStore],
  templateUrl: './budget-vs-actual-page.component.html',
  styleUrl: './budget-vs-actual-page.component.scss',
})
export class BudgetVsActualPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  store = inject(BudgetVsActualStore);
  vm = this.store.vm;

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

  form = this.fb.group({
    year: this.fb.control(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    month: this.fb.control(new Date().getMonth() + 1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(12)],
    }),
  });

  ngOnInit(): void {
    // inicial
    this.store.setPeriod(
      this.form.controls.year.value,
      this.form.controls.month.value,
    );
    this.store.load();
  }

  apply() {
    if (this.form.invalid) return;

    const { year, month } = this.form.getRawValue();
    this.store.setPeriod(year, month);
    this.store.load();
  }

  statusLabel(s: BudgetStatus) {
    switch (s) {
      case 'NoBudget':
        return 'Sem orçamento';
      case 'Ok':
        return 'OK';
      case 'Warning':
        return 'Atenção';
      case 'Exceeded':
        return 'Estourou';
      default:
        return s;
    }
  }
}
