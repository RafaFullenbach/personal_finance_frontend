import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { RecurringStore } from '../../data-access/recurring.store';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-recurring-generate-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [RecurringStore],
  templateUrl: './recurring-generate-page.component.html',
  styleUrl: './recurring-generate-page.component.scss',
})
export class RecurringGeneratePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  store = inject(RecurringStore);

  toast = inject(ToastService);

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
    year: this.fb.control(new Date().getFullYear(), { nonNullable: true }),
    month: this.fb.control(new Date().getMonth() + 1, { nonNullable: true }),
  });

  ngOnInit(): void {}

  generate() {
    const y = this.form.controls.year.value;
    const m = this.form.controls.month.value;

    this.store.generate(y, m, () => {
      this.toast.success("Recorrências geradas com sucesso!")
      this.router.navigate(['/recurring'])
    });
  }
}
