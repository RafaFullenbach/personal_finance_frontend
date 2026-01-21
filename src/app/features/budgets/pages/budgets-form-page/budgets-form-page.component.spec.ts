import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsFormPageComponent } from './budgets-form-page.component';

describe('BudgetsFormPageComponent', () => {
  let component: BudgetsFormPageComponent;
  let fixture: ComponentFixture<BudgetsFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetsFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
