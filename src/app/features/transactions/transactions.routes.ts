import { Routes } from '@angular/router';
import { ClearTransactionsStateGuard } from './guards/clear-transactions-query.guard';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    canDeactivate: [ClearTransactionsStateGuard],
    loadComponent: () =>
      import('./pages/transactions-list-page/transactions-list-page.component').then(
        (m) => m.TransactionsListPageComponent,
      ),
  },
  {
    path: 'new',
    canDeactivate: [ClearTransactionsStateGuard],
    loadComponent: () =>
      import('./pages/transactions-create-page/transactions-create-page.component').then(
        (m) => m.TransactionsCreatePageComponent,
      ),
  },
  {
    path: ':id/edit',
    canDeactivate: [ClearTransactionsStateGuard],
    loadComponent: () =>
      import('./pages/transactions-create-page/transactions-create-page.component').then(
        (m) => m.TransactionsCreatePageComponent,
      ),
  },
];
