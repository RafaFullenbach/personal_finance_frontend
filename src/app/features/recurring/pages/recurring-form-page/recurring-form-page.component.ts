import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { RecurringStore } from '../../data-access/recurring.store';
import { TransactionType } from '../../../transactions/data-access/transactions.api';

import { AccountsStore } from '../../../accounts/data-access/accounts.store';
import { CategoriesStore } from '../../../categories/data-access/categories.store';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../core/toast/toast.service';

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
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  store = inject(RecurringStore);
  accountsStore = inject(AccountsStore);
  categoriesStore = inject(CategoriesStore);

  recurringId = this.route.snapshot.paramMap.get('id');
  isEditMode = signal(!!this.recurringId);

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
    categoryId: this.fb.control<string | null>(null),
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

    if (!this.recurringId) {
      return;
    }

    this.store.loadById(this.recurringId, (item) => {
      this.form.patchValue({
        description: item.description,
        amount: item.amount,
        type: item.type,
        accountId: item.accountId,
        categoryId: item.categoryId ?? null,
        dayOfMonth: item.dayOfMonth,
        competenceOffsetMonths: item.competenceOffsetMonths,
        startDate: item.startDate ? new Date(item.startDate) : null,
        endDate: item.endDate ? new Date(item.endDate) : null,
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const payload = {
      description: v.description!,
      amount: v.amount!,
      type: v.type!,
      accountId: v.accountId!,
      categoryId: v.categoryId ?? null,
      dayOfMonth: v.dayOfMonth!,
      competenceOffsetMonths: v.competenceOffsetMonths!,
      startDate: (v.startDate as Date).toISOString(),
      endDate: v.endDate ? v.endDate.toISOString() : null,
    };

    if (this.recurringId) {
      this.store.update(this.recurringId, payload, () => {
        this.toast.success('Recorrência atualizada com sucesso.');
        this.router.navigate(['/recurring']);
      });
      return;
    }

    this.store.create(payload, () => {
      this.toast.success('Recorrência criada com sucesso.');
      this.router.navigate(['/recurring']);
    });
  }
}
