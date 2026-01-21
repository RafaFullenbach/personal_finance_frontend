import { BudgetVsActualDto } from './budgets.api';
import { BudgetVsActualRow } from './budgets.model';

export function mapBudgetVsActualRow(x: BudgetVsActualDto): BudgetVsActualRow {
  return { ...x };
}
