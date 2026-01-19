import { TransactionListItemDto } from './transactions.api';
import { TransactionsModel } from './transactions.model';

export function mapTransactionListItem(
  dto: TransactionListItemDto,
): TransactionsModel {
  return {
    ...dto,
    recurringTemplateId: dto.recurringTemplateId ?? null,
    transactionDate: new Date(dto.transactionDate),
  };
}
