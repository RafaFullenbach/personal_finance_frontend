import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthClosePageComponent } from './month-close-page.component';

describe('MonthClosePageComponent', () => {
  let component: MonthClosePageComponent;
  let fixture: ComponentFixture<MonthClosePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthClosePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthClosePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
