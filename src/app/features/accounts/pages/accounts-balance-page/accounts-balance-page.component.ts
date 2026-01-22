import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { AccountsBalanceStore } from '../../data-access/accounts-balance.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accounts-balance-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  providers: [AccountsBalanceStore],
  templateUrl: './accounts-balance-page.component.html',
  styleUrl: './accounts-balance-page.component.scss',
})
export class AccountsBalancePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  store = inject(AccountsBalanceStore);
  vm = this.store.vm;

  form = this.fb.group({
    date: this.fb.control<Date>(new Date(), { nonNullable: true }),
  });

  ngOnInit(): void {
    this.store.setDate(this.form.controls.date.value);
    this.store.loadAll();
  }

  reload() {
    this.store.setDate(this.form.controls.date.value);
    this.store.loadAll();
  }
}
