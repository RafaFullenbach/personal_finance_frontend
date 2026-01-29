import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TransactionsApi } from './transactions.api';

describe('TransactionsApi', () => {
  let api: TransactionsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsApi,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    api = TestBed.inject(TransactionsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // garante que não ficou request pendente
    httpMock.verify();
  });

  it('getAll: deve montar query params corretamente', () => {
    api
      .getAll({
        page: 2,
        pageSize: 20,
        year: 2026,
        month: 1,
        type: 'Debit' as any,
        status: 'Pending' as any,
        description: 'mercado',
        sortBy: 'transactionDate',
        order: 'desc',
      })
      .subscribe((res) => {
        expect(res).toBeTruthy();
      });

    // ⚠️ Ajuste a URL esperada conforme sua API
    const req = httpMock.expectOne((r) => {
      // se sua URL for tipo '/api/transactions'
      return r.method === 'GET' && r.url.includes('transactions');
    });

    expect(req.request.method).toBe('GET');

    // query params
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('20');
    expect(req.request.params.get('year')).toBe('2026');
    expect(req.request.params.get('month')).toBe('1');
    expect(req.request.params.get('type')).toBe('Debit');
    expect(req.request.params.get('status')).toBe('Pending');
    expect(req.request.params.get('description')).toBe('mercado');
    expect(req.request.params.get('sortBy')).toBe('transactionDate');
    expect(req.request.params.get('order')).toBe('desc');

    req.flush({
      items: [],
      page: 2,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
    });
  });

  it('confirm: deve fazer POST no endpoint correto', () => {
    const id = 'abc-123';

    api.confirm(id).subscribe();

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes(id) && r.url.includes('confirm'));
    expect(req.request.method).toBe('POST');

    req.flush(null);
  });

  it('cancel: deve fazer POST no endpoint correto', () => {
    const id = 'abc-123';

    api.cancel(id).subscribe();

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes(id) && r.url.includes('cancel'));
    expect(req.request.method).toBe('POST');

    req.flush(null);
  });

  it('create: deve fazer POST com body', () => {
    const body: any = {
      description: 'Teste',
      amount: 100,
      type: 'Debit',
      transactionDate: '2026-01-01',
      accountId: 'acc-1',
      categoryId: null,
    };

    api.create(body).subscribe();

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes('transactions'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(null);
  });

  it('update: deve fazer PUT/PATCH com body (conforme sua API)', () => {
    const id = 'abc-123';
    const body: any = {
      description: 'Atualizado',
      amount: 200,
    };

    api.update(id, body).subscribe();

    // ⚠️ Ajuste se sua API usa PUT ou PATCH
    const req = httpMock.expectOne((r) => (r.method === 'PUT' || r.method === 'PATCH') && r.url.includes(id));
    expect(['PUT', 'PATCH']).toContain(req.request.method);
    expect(req.request.body).toEqual(body);

    req.flush(null);
  });

  it('getById: deve fazer GET /:id', () => {
    const id = 'abc-123';

    api.getById(id).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url.includes(id));
    expect(req.request.method).toBe('GET');

    req.flush({ id });
  });
});
