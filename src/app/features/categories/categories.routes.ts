import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categories-list-page/categories-list-page.component').then(
        (m) => m.CategoriesListPageComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/categories-upsert-page/categories-upsert-page.component').then(
        (m) => m.CategoriesUpsertPageComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/categories-upsert-page/categories-upsert-page.component').then(
        (m) => m.CategoriesUpsertPageComponent,
      ),
  },
];
