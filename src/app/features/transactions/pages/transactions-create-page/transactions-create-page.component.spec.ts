import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsCreatePageComponent } from './transactions-create-page.component';

describe('TransactionsCreatePageComponent', () => {
  let component: TransactionsCreatePageComponent;
  let fixture: ComponentFixture<TransactionsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
