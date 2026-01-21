import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsListPageComponent } from './budgets-list-page.component';

describe('BudgetsListPageComponent', () => {
  let component: BudgetsListPageComponent;
  let fixture: ComponentFixture<BudgetsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
