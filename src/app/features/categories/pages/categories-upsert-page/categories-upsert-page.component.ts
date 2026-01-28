import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CategoryType } from '../../data-access/categories.api';
import { CategoriesUpsertStore } from '../../data-access/categories-upsert.store';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-categories-upsert-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [CategoriesUpsertStore],
  templateUrl: './categories-upsert-page.component.html',
  styleUrl: './categories-upsert-page.component.scss',
})
export class CategoriesUpsertPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(CategoriesUpsertStore);

  private toast = inject(ToastService);

  id = this.route.snapshot.paramMap.get('id');

  form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.maxLength(60)]),
    type: this.fb.control<CategoryType | null>(null, [Validators.required]),
  });

  types: { value: CategoryType; label: string }[] = [
    { value: 'Expense', label: 'Despesa' },
    { value: 'Income', label: 'Receita' },
  ];

  ngOnInit(): void {
    if (!this.id) return;

    this.store.load(this.id);

    // simples e direto: quando item chegar, patch
    const timer = setInterval(() => {
      const c = this.store.item();
      if (!c) return;

      this.form.patchValue(
        { name: c.name, type: c.type },
        { emitEvent: false },
      );
      clearInterval(timer);
    }, 50);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.id) {
      this.store.update(this.id, { name: v.name!, type: v.type! }, () => {
        this.toast.success('Categoria atualizada com sucesso.');
        this.router.navigate(['/categories']);
      });
    } else {
      this.store.create({ name: v.name!, type: v.type! }, () => {
        this.toast.success('Categoria criada com sucesso.');
        this.router.navigate(['/categories']);
      });
    }
  }
}
