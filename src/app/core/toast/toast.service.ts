import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snack = inject(MatSnackBar);

  success(message: string) {
    this.snack.open(message, 'OK', {
      duration: 2500,
      panelClass: ['pf-snackbar', 'pf-snackbar--success'],
    });
  }

  error(message: string) {
    this.snack.open(message, 'Fechar', {
      duration: 6000,
      panelClass: ['pf-snackbar', 'pf-snackbar--error'],
    });
  }

  info(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
      panelClass: ['pf-snackbar', 'pf-snackbar--info'],
    });
  }
}
