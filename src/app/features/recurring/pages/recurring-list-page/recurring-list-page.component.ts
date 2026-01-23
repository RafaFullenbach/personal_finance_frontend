import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { RecurringStore } from '../../data-access/recurring.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recurring-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [RecurringStore],
  templateUrl: './recurring-list-page.component.html',
  styleUrl: './recurring-list-page.component.scss',
})
export class RecurringListPageComponent implements OnInit {
  store = inject(RecurringStore);

  displayedColumns = [
    'description',
    'amount',
    'type',
    'dayOfMonth',
    'competenceOffsetMonths',
    'startDate',
    'endDate',
  ];

  ngOnInit(): void {
    this.store.load();
  }

  typeLabel(t: 'Debit' | 'Credit') {
    return t === 'Debit' ? 'Despesa' : 'Receita';
  }
}
