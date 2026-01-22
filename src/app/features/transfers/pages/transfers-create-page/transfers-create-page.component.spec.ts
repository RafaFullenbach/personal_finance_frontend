import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersCreatePageComponent } from './transfers-create-page.component';

describe('TransfersCreatePageComponent', () => {
  let component: TransfersCreatePageComponent;
  let fixture: ComponentFixture<TransfersCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
