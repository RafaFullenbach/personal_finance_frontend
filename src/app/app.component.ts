import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  template: `
    <div class="p-6">
      <button mat-raised-button color="primary" (click)="ping()">Test /transactions</button>
      <pre class="mt-4 text-sm">{{ last | json }}</pre>
    </div>
  `,
})
export class AppComponent {
  private http = inject(HttpClient);
  last: unknown = null;

  ping() {
    this.http.get('/transactions').subscribe({
      next: (r) => (this.last = r),
      error: (e) => (this.last = e), // aqui você deve ver AppError tipado
    });
  }
}
