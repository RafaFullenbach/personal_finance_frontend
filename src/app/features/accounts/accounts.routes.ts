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
      import('./pages/account-create-page/account-create-page.component').then(
        (m) => m.AccountCreatePageComponent,
      ),
  },
];
