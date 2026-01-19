import { AccountsModel } from './accounts.model';

export function mapAccountListItem(dto: AccountsModel): AccountsModel {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    isActive: dto.isActive,
  };
}
