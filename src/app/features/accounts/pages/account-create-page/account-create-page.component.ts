import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AccountType } from '../../data-access/accounts.api';
import { AccountsCreateStore } from '../../data-access/accounts-create.store';
import { ToastService } from '../../../../core/ui/toast.service';

@Component({
  selector: 'app-account-create-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [AccountsCreateStore],
  templateUrl: './account-create-page.component.html',
  styleUrl: './account-create-page.component.scss',
})
export class AccountCreatePageComponent {
  private fb = inject(FormBuilder);
  
  private router = inject(Router);

  store = inject(AccountsCreateStore);

  private toast = inject(ToastService);
  

  types: { value: AccountType; label: string }[] = [
    { value: 'Bank', label: 'Conta corrente' },
    { value: 'CreditCard', label: 'Cartão de crédito' },
    { value: 'Investment', label: 'Investimentos' },
    { value: 'Cash', label: 'Dinheiro' },
  ];

  form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
    type: this.fb.control<AccountType | null>(null, [Validators.required]),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.store.create(
      {
        name: v.name!,
        type: v.type!,
      },
      () => {
        this.toast.success('Conta criada com sucesso.');
        this.router.navigate(['/accounts'])
      },
    );
  }
}
