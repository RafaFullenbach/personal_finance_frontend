import { Routes } from '@angular/router';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/transactions-list-page/transactions-list-page.component'
      ).then((m) => m.TransactionsListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import(
        './pages/transactions-create-page/transactions-create-page.component'
      ).then((m) => m.TransactionsCreatePageComponent),
  },
];
