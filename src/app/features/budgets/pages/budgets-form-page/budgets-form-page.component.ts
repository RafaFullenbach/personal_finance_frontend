import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { BudgetsStore } from '../../data-access/budgets.store';
import { BudgetDto, BudgetsApi } from '../../data-access/budgets.api';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesStore } from '../../../categories/data-access/categories.store';

@Component({
  selector: 'app-budgets-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  providers: [BudgetsStore, CategoriesStore],
  templateUrl: './budgets-form-page.component.html',
  styleUrl: './budgets-form-page.component.scss',
})
export class BudgetsFormPageComponent implements OnInit {
  store = inject(BudgetsStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(BudgetsApi);
  categoriesStore = inject(CategoriesStore);

  isEditMode = signal(false);
  budgetId = signal<string | null>(null);

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
    categoryId: this.fb.control<string | null>(null, [Validators.required]),
    year: this.fb.control<number>(new Date().getFullYear(), {
      nonNullable: true,
    }),
    month: this.fb.control<number>(new Date().getMonth() + 1, {
      nonNullable: true,
    }),
    limitAmount: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    isActive: this.fb.control<boolean>(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.categoriesStore.load();

    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!id);

    if (!id) return;

    this.store.loading.set(true);
    this.store.error.set(null);

    this.api.getById(id).subscribe({
      next: (b) => {
        this.form.patchValue({
          categoryId: b.categoryId,
          year: b.year,
          month: b.month,
          limitAmount: b.limitAmount,
          isActive: b.isActive,
        });
        this.store.loading.set(false);
      },
      error: (e) => {
        this.store.error.set(e);
        this.store.loading.set(false);
      },
    });

  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.store.upsert(
      {
        categoryId: v.categoryId!,
        year: v.year,
        month: v.month,
        limitAmount: v.limitAmount!,
        isActive: v.isActive,
      },
      () => this.router.navigate(['/budgets']),
    );
  }
}
