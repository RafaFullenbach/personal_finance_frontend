import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface MonthlySummaryDto {
  year: number;
  month: number;
  totalCredits: number;
  totalDebits: number;
  net: number;
  transactionsCount: number;
}

export interface BalanceDto {
  date: string;
  totalCredits: number;
  totalDebits: number;
  balance: number;
  transactionsCount: number;
}

export type BudgetStatus = 'NoBudget' | 'Ok' | 'Warning' | 'Exceeded';

export interface BudgetVsActualItemDto {
  categoryId: string;
  categoryName: string;
  budget: number | null;
  actual: number;
  difference: number;
  percentageUsed: number | null;
  status: BudgetStatus;
}

@Injectable({ providedIn: 'root' })
export class ReportsApi {
  private http = inject(HttpClient);

  monthlySummary(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<MonthlySummaryDto>('/reports/monthly-summary', { params });
  }

  balance(dateIso: string) {
    const params = new HttpParams().set('date', dateIso);
    return this.http.get<BalanceDto>('/reports/balance', { params });
  }

  budgetVsActual(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<BudgetVsActualItemDto[]>('/reports/budget-vs-actual', { params });
  }
}
