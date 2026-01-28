import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { TransfersCreateStore } from '../../data-access/transfers-create.store';

import { AccountsStore } from '../../../accounts/data-access/accounts.store';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-transfers-create-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [TransfersCreateStore, AccountsStore],
  templateUrl: './transfers-create-page.component.html',
  styleUrl: './transfers-create-page.component.scss',
})
export class TransfersCreatePageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  toast = inject(ToastService);
  store = inject(TransfersCreateStore);
  accountsStore = inject(AccountsStore);

  form = this.fb.group({
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(120),
    ]),
    amount: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),

    fromAccountId: this.fb.control<string | null>(null, [Validators.required]),
    toAccountId: this.fb.control<string | null>(null, [Validators.required]),

    transactionDate: this.fb.control<Date | null>(new Date(), [
      Validators.required,
    ]),
    competenceYear: this.fb.control<number>(new Date().getFullYear(), {
      nonNullable: true,
    }),
    competenceMonth: this.fb.control<number>(new Date().getMonth() + 1, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(12)],
    }),
  });

  constructor() {
    this.accountsStore.load();

    this.form.controls.transactionDate.valueChanges.subscribe((d) => {
      if (!d) return;
      this.form.patchValue(
        { competenceYear: d.getFullYear(), competenceMonth: d.getMonth() + 1 },
        { emitEvent: false },
      );
    });
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
        fromAccountId: v.fromAccountId!,
        toAccountId: v.toAccountId!,
        transactionDate: (v.transactionDate as Date).toISOString(),
        competenceYear: v.competenceYear!,
        competenceMonth: v.competenceMonth!,
      },
      () => {
        this.toast.success('Transferência criada com sucesso.');
        this.router.navigate(['/transfers']);
      },
    );
  }
}
