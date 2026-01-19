import { Guid, TransactionStatus, TransactionType } from './transactions.api';

export interface TransactionsModel {
  id: Guid;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: Date;
  competenceYear: number;
  competenceMonth: number;
  description: string;
  accountId: Guid;
  recurringTemplateId?: Guid | null;
}
