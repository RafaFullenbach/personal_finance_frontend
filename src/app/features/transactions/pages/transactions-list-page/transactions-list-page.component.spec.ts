import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListPageComponent } from './transactions-list-page.component';

describe('TransactionsListPageComponent', () => {
  let component: TransactionsListPageComponent;
  let fixture: ComponentFixture<TransactionsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
