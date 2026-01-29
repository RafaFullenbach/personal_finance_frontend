import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { TransactionsStore } from './transactions.store';
import { TransactionsApi } from './transactions.api';

describe('TransactionsStore', () => {
  let store: TransactionsStore;
  let api: jasmine.SpyObj<TransactionsApi>;

  beforeEach(() => {
    api = jasmine.createSpyObj<TransactionsApi>('TransactionsApi', [
      'getAll',
      'confirm',
      'cancel',
      'create',
      'getById',
      'update',
    ]);

    api.getAll.and.returnValue(
      of({
        items: [],
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
      } as any)
    );

    TestBed.configureTestingModule({
      providers: [
        TransactionsStore,
        { provide: TransactionsApi, useValue: api },
      ],
    });

    store = TestBed.inject(TransactionsStore);
  });

  it('setFilters: deve trimar description, resetar page=1 e chamar getAll com params corretos', () => {
    // prepara estado sem disparar load()
    store.page.set(3);
    store.pageSize.set(20);

    store.setFilters({
      year: 2026,
      month: 1,
      type: 'Debit',
      status: 'Pending',
      description: '  mercado  ',
    });

    expect(store.filterYear()).toBe(2026);
    expect(store.filterMonth()).toBe(1);
    expect(store.filterDescription()).toBe('mercado');
    expect(store.page()).toBe(1);

    expect(api.getAll).toHaveBeenCalled();

    const args = api.getAll.calls.mostRecent().args[0];
    expect(args.year).toBe(2026);
    expect(args.month).toBe(1);
    expect(args.type).toBe('Debit');
    expect(args.status).toBe('Pending');
    expect(args.description).toBe('mercado');
    expect(args.page).toBe(1);
    expect(args.pageSize).toBe(20);
  });

  it('clearFilters: deve limpar filtros e chamar load', () => {
    store.setFilters({
      year: 2026,
      month: 1,
      type: 'Credit',
      status: 'Confirmed',
      description: 'teste',
    });

    store.clearFilters();

    expect(store.filterYear()).toBeNull();
    expect(store.filterMonth()).toBeNull();
    expect(store.filterType()).toBeNull();
    expect(store.filterStatus()).toBeNull();
    expect(store.filterDescription()).toBe('');
    expect(store.page()).toBe(1);

    expect(api.getAll).toHaveBeenCalled();
  });

  it('load: em caso de erro deve setar error e loading=false', () => {
    api.getAll.and.returnValue(throwError(() => ({ message: 'boom' })));

    store.load();

    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeTruthy();
  });
});
