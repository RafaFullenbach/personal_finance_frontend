import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringFormPageComponent } from './recurring-form-page.component';

describe('RecurringFormPageComponent', () => {
  let component: RecurringFormPageComponent;
  let fixture: ComponentFixture<RecurringFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
