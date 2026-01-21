import { BudgetVsActualStatus } from './budgets.api';

export interface BudgetVsActualRow {
  categoryId: string;
  categoryName: string;
  budget: number;
  actual: number;
  difference: number;
  percentageUsed: number;
  status: BudgetVsActualStatus;
}
