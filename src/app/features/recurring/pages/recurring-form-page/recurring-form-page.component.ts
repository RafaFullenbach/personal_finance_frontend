import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { RecurringStore } from '../../data-access/recurring.store';
import { TransactionType } from '../../../transactions/data-access/transactions.api'; // ajuste se estiver em outro lugar

import { AccountsStore } from '../../../accounts/data-access/accounts.store'; // ajuste path
import { CategoriesStore } from '../../../categories/data-access/categories.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recurring-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  providers: [RecurringStore, AccountsStore, CategoriesStore],
  templateUrl: './recurring-form-page.component.html',
  styleUrl: './recurring-form-page.component.scss',
})
export class RecurringFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  store = inject(RecurringStore);
  accountsStore = inject(AccountsStore);
  categoriesStore = inject(CategoriesStore);

  types: { value: TransactionType; label: string }[] = [
    { value: 'Debit', label: 'Despesa' },
    { value: 'Credit', label: 'Receita' },
  ];

  form = this.fb.group({
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(120),
    ]),
    amount: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    type: this.fb.control<TransactionType | null>(null, [Validators.required]),
    accountId: this.fb.control<string | null>(null, [Validators.required]),
    categoryId: this.fb.control<string | null>(null, [Validators.required]),
    dayOfMonth: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(31),
    ]),
    competenceOffsetMonths: this.fb.control<number>(0, [Validators.required]),
    startDate: this.fb.control<Date | null>(new Date(), [Validators.required]),
    endDate: this.fb.control<Date | null>(null),
  });

  ngOnInit(): void {
    this.accountsStore.load();
    this.categoriesStore.load();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.store.create(
      {
        description: v.description!,
        amount: v.amount!,
        type: v.type!,
        accountId: v.accountId!,
        categoryId: v.categoryId ?? null,
        dayOfMonth: v.dayOfMonth!,
        competenceOffsetMonths: v.competenceOffsetMonths!,
        startDate: (v.startDate as Date).toISOString(),
        endDate: v.endDate ? v.endDate.toISOString() : null,
      },
      () => this.router.navigate(['/recurring']),
    );
  }
}
