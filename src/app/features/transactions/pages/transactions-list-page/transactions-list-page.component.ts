import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TransactionsStore } from '../../data-access/transactions.store';

@Component({
  selector: 'app-transactions-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [TransactionsStore],
  templateUrl: './transactions-list-page.component.html',
  styleUrl: './transactions-list-page.component.scss',
})
export class TransactionsListPageComponent implements OnInit {
  store = inject(TransactionsStore);

  displayedColumns: string[] = [
    'transactionDate',
    'description',
    'amount',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.store.load();
  }

  onPage(e: PageEvent) {
    this.store.setPage(e.pageIndex + 1, e.pageSize);
  }
}
