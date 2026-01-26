import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetVsActualPageComponent } from './budget-vs-actual-page.component';

describe('BudgetVsActualPageComponent', () => {
  let component: BudgetVsActualPageComponent;
  let fixture: ComponentFixture<BudgetVsActualPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetVsActualPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetVsActualPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
