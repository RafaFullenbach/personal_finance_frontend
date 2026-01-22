import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MonthCloseStore } from '../../data-access/months-close.store';

@Component({
  selector: 'app-month-close-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  providers: [MonthCloseStore],
  templateUrl: './month-close-page.component.html',
  styleUrl: './month-close-page.component.scss',
})
export class MonthClosePageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  store = inject(MonthCloseStore);

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
    autoConfirmPending: this.fb.control(true, { nonNullable: true }),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { year, month, autoConfirmPending } = this.form.getRawValue();

    this.store.close(year, month, autoConfirmPending, () => {
      this.router.navigate(['/dashboard']);
    });
  }
}
