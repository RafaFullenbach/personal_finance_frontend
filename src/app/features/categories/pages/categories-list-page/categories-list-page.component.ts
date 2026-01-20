import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CategoriesStore } from '../../data-access/categories.store';
import { ToastService } from '../../../../core/ui/toast.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-categories-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  providers: [CategoriesStore],
  templateUrl: './categories-list-page.component.html',
  styleUrl: './categories-list-page.component.scss',
})
export class CategoriesListPageComponent implements OnInit {
  store = inject(CategoriesStore);

  toast = inject(ToastService);

  displayedColumns = ['name', 'type', 'activate', 'edit'];

  ngOnInit(): void {
    this.store.load();
  }

  activate(id: string) {
    this.toast.success('Categoria ativada com sucesso.');
    this.store.activate(id);
  }

  deactivate(id: string) {
    this.toast.error('Categoria desativada com sucesso.');
    this.store.deactivate(id);
  }
}
