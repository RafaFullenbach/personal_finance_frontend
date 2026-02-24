import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { RecurringStore } from '../../data-access/recurring.store';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-recurring-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
  ],
  providers: [RecurringStore],
  templateUrl: './recurring-list-page.component.html',
  styleUrl: './recurring-list-page.component.scss',
})
export class RecurringListPageComponent implements OnInit {
  store = inject(RecurringStore);
  private toast = inject(ToastService);

  displayedColumns = [
    'description',
    'amount',
    'type',
    'dayOfMonth',
    'competenceOffsetMonths',
    'startDate',
    'endDate',
    'status',
    'activate',
    'edit',
  ];

  ngOnInit(): void {
    this.store.load();
  }

  typeLabel(t: 'Debit' | 'Credit') {
    return t === 'Debit' ? 'Despesa' : 'Receita';
  }

  activate(id: string) {
    this.toast.success('Recorrência ativada com sucesso.');
    this.store.activate(id);
  }

  deactivate(id: string) {
    this.toast.error('Recorrência desativada com sucesso.');
    this.store.deactivate(id);
  }
}
