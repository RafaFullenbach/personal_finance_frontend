import { TransactionListItemDto } from './transactions.api';
import { TransactionListItem } from './transactions.model';

export function mapTransactionListItem(
  dto: TransactionListItemDto
): TransactionListItem {
  return {
    ...dto,
    recurringTemplateId: dto.recurringTemplateId ?? null,
    transactionDate: new Date(dto.transactionDate),
  };
}
