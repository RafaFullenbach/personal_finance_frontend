import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TransactionsListPageComponent } from './transactions-list-page.component';
import { TransactionsStore } from '../../data-access/transactions.store';
import { ToastService } from '../../../../core/toast/toast.service';

describe('TransactionsListPageComponent', () => {
  let fixture: ComponentFixture<TransactionsListPageComponent>;
  let component: TransactionsListPageComponent;

  let store: jasmine.SpyObj<TransactionsStore>;

  beforeEach(async () => {
    store = jasmine.createSpyObj<TransactionsStore>('TransactionsStore', [
      'load',
      'setFilters',
      'setPage',
      'clearFilters',
      'confirm',
      'cancel',
    ]);

    // usado no template
    (store as any).vm = () => ({ loading: false });
    (store as any).loading = () => false;

    // se você hidrata o form no init
    (store as any).filterYear = () => null;
    (store as any).filterMonth = () => null;
    (store as any).filterType = () => null;
    (store as any).filterStatus = () => null;
    (store as any).filterDescription = () => '';

    const toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [TransactionsListPageComponent, RouterTestingModule],
      providers: [{ provide: ToastService, useValue: toast }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      // ✅ aqui é o pulo do gato: substitui o provider local do componente
      .overrideProvider(TransactionsStore, { useValue: store })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve chamar store.load no ngOnInit', () => {
    expect(store.load).toHaveBeenCalled();
  });

  it('description: deve aplicar filtro apenas depois do debounce', fakeAsync(() => {
    component.filtersForm.controls.description.setValue('  mercado  ');

    tick(399);
    expect(store.setFilters).not.toHaveBeenCalled();

    tick(1);
    expect(store.setFilters).toHaveBeenCalled();

    const args = store.setFilters.calls.mostRecent().args[0];
    expect(args.description).toBe('mercado');
  }));

  it('month: deve aplicar filtro imediato', () => {
    component.filtersForm.controls.month.setValue(1);
    expect(store.setFilters).toHaveBeenCalled();
  });

  it('clearFilters: deve chamar store.clearFilters', () => {
    component.filtersForm.controls.description.setValue('abc');
    component.clearFilters();

    expect(store.clearFilters).toHaveBeenCalled();
    expect(component.filtersForm.controls.description.value).toBe('');
  });
});
