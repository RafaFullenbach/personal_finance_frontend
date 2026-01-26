import { Routes } from '@angular/router';

export const BUDGETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/budgets-list-page/budgets-list-page.component').then(
        (m) => m.BudgetsListPageComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/budgets-form-page/budgets-form-page.component').then(
        (m) => m.BudgetsFormPageComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/budgets-form-page/budgets-form-page.component').then(
        (m) => m.BudgetsFormPageComponent,
      ),
  },
  {
    path: 'vs-actual',
    loadComponent: () =>
      import('./pages/budget-vs-actual-page/budget-vs-actual-page.component').then(
        (m) => m.BudgetVsActualPageComponent,
      ),
  },
];
