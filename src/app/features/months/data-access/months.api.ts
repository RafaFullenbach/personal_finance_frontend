import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MonthsApi {
  private http = inject(HttpClient);

  closeMonth(year: number, month: number, autoConfirmPending: boolean = true) {
    const params = new HttpParams().set(
      'autoConfirmPending',
      String(autoConfirmPending),
    );

    return this.http.post<void>(`/months/${year}/${month}/close`, null, {
      params, 
    });
  }
}
