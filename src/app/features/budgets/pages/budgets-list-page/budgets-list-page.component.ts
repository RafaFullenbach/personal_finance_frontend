import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BudgetsStore } from '../../data-access/budgets.store';
import { BudgetDto } from '../../data-access/budgets.api';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastService } from '../../../../core/ui/toast.service';

@Component({
  selector: 'app-budgets-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    RouterLink,
  ],
  providers: [BudgetsStore],
  templateUrl: './budgets-list-page.component.html',
  styleUrl: './budgets-list-page.component.scss',
})
export class BudgetsListPageComponent implements OnInit {
  store = inject(BudgetsStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  toast = inject(ToastService);

  // displayedColumns = ['category', 'limit', 'active', 'edit'];
  displayedColumns = ['category', 'limit', 'edit'];

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

  periodForm = this.fb.group({
    year: this.fb.control<number>(new Date().getFullYear(), {
      nonNullable: true,
    }),
    month: this.fb.control<number>(new Date().getMonth() + 1, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.store.load();
  }

  applyPeriod() {
    const { year, month } = this.periodForm.getRawValue();
    this.store.setPeriod(year, month);
  }

  goEdit(b: BudgetDto) {
    // sem GET /budgets/:id, mandamos o budget via state para pré-preencher o form
    this.router.navigate(['/budgets', b.id, 'edit'], {
      state: { budget: b },
    });
  }

  activate(id: string) {
    this.toast.success('Orçamento ativado com sucesso.');
    this.store.activate(id);
  }

  deactivate(id: string) {
    this.toast.error('Orçamento desativado com sucesso.');
    this.store.deactivate(id);
  }
}
