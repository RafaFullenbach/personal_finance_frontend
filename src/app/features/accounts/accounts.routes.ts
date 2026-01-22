import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/account-list-page/account-list-page.component').then(
        (m) => m.AccountListPageComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/accounts-upsert-page/accounts-upsert-page.component').then(
        (m) => m.AccountsUpsertPageComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/accounts-upsert-page/accounts-upsert-page.component').then(
        (m) => m.AccountsUpsertPageComponent,
      ),
  },
  {
    path: 'balance',
    loadComponent: () =>
      import('./pages/accounts-balance-page/accounts-balance-page.component').then(
        (m) => m.AccountsBalancePageComponent,
      ),
  },
];
