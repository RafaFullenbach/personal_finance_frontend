import { ClearTransactionsStateGuard } from "./clear-transactions-query.guard";

describe('ClearTransactionsStateGuard', () => {
  let guard: ClearTransactionsStateGuard;

  beforeEach(() => {
    guard = new ClearTransactionsStateGuard();
    spyOn(localStorage, 'removeItem');
  });

  it('NÃO deve limpar storage quando navegar para rota dentro de /transactions', () => {
    const nextState = { url: '/transactions/123/edit' };

    const can = guard.canDeactivate(null as any, null as any, null as any, nextState as any);

    expect(can).toBeTrue();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('deve limpar storage quando sair de /transactions', () => {
    const nextState = { url: '/reports' };

    const can = guard.canDeactivate(null as any, null as any, null as any, nextState as any);

    expect(can).toBeTrue();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});
