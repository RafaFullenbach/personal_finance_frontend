import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringListPageComponent } from './recurring-list-page.component';

describe('RecurringListPageComponent', () => {
  let component: RecurringListPageComponent;
  let fixture: ComponentFixture<RecurringListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
