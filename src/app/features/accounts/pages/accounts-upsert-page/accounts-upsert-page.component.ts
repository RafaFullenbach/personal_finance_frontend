import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AccountType } from '../../data-access/accounts.api';
import { AccountsUpsertStore } from '../../data-access/accounts-upsert.store';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-accounts-upsert-page',
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
  providers: [AccountsUpsertStore],
  templateUrl: './accounts-upsert-page.component.html',
  styleUrl: './accounts-upsert-page.component.scss',
})
export class AccountsUpsertPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(AccountsUpsertStore);

  private toast = inject(ToastService);

  accountId = this.route.snapshot.paramMap.get('id'); // se tiver, é edit
  isEditMode = computed(() => !!this.accountId);

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

  ngOnInit(): void {
    if (!this.accountId) return;

    this.store.load(this.accountId);

    // quando carregar, preenche o form
    // (simples e direto; depois podemos deixar com effect/subscribe)
    const interval = setInterval(() => {
      const acc = this.store.account();
      if (!acc) return;

      this.form.patchValue(
        {
          name: acc.name,
          type: acc.type as AccountType,
        },
        { emitEvent: false },
      );
      clearInterval(interval);
    }, 50);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.accountId) {
      this.store.update(
        this.accountId,
        {
          name: v.name!,
          type: v.type!,
        },
        () => {
          this.toast.success('Conta atualizada com sucesso.');
          this.router.navigate(['/accounts']);
        },
      );
      return;
    }

    this.store.create(
      {
        name: v.name!,
        type: v.type!,
      },
      () => {
        this.toast.success('Conta criada com sucesso.');
        this.router.navigate(['/accounts']);
      },
    );
  }
}
