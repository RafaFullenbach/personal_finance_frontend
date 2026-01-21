import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetLimitCellComponent } from './budget-limit-cell.component';

describe('BudgetLimitCellComponent', () => {
  let component: BudgetLimitCellComponent;
  let fixture: ComponentFixture<BudgetLimitCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetLimitCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetLimitCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
