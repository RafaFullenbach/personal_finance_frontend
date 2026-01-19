export type Guid = string;

export interface AccountsModel {
  id: Guid;
  name: string;
  type: string;
  isActive: boolean;
}
