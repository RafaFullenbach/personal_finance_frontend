import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringGeneratePageComponent } from './recurring-generate-page.component';

describe('RecurringGeneratePageComponent', () => {
  let component: RecurringGeneratePageComponent;
  let fixture: ComponentFixture<RecurringGeneratePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringGeneratePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
