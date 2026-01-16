import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TransactionType } from '../../data-access/transactions.api';
import { TransactionsStore } from '../../data-access/transactions.store';
import { AccountsStore } from '../../../accounts/data-access/accounts.store';
import { CategoriesStore } from '../../../categories/data-access/categories.store';

@Component({
  selector: 'app-transactions-create-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, // ✅ faltava
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [TransactionsStore, AccountsStore, CategoriesStore],
  templateUrl: './transactions-create-page.component.html',
  styleUrl: './transactions-create-page.component.scss',
})
export class TransactionsCreatePageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  store = inject(TransactionsStore);
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
    transactionDate: this.fb.control<Date | null>(new Date(), [
      Validators.required,
    ]),
    competenceYear: this.fb.control<number | null>(new Date().getFullYear(), [
      Validators.required,
    ]),
    competenceMonth: this.fb.control<number | null>(new Date().getMonth() + 1, [
      Validators.required,
      Validators.min(1),
      Validators.max(12),
    ]),
    accountId: this.fb.control<string | null>(null, [Validators.required]),
    categoryId: this.fb.control<string | null>(null, []),
  });

  constructor() {
    this.form.controls.transactionDate.valueChanges
      .pipe(takeUntilDestroyed()) // ✅ padrão sênior
      .subscribe((d) => {
        if (!d) return;
        this.form.patchValue(
          {
            competenceYear: d.getFullYear(),
            competenceMonth: d.getMonth() + 1,
          },
          { emitEvent: false }
        );
      });
  }

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
        transactionDate: (v.transactionDate as Date).toISOString(),
        competenceYear: v.competenceYear!,
        competenceMonth: v.competenceMonth!,
        accountId: v.accountId!,
      },
      () => this.router.navigate(['/transactions'])
    );
  }
}
