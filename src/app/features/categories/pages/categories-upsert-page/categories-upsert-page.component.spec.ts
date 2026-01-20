import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesUpsertPageComponent } from './categories-upsert-page.component';

describe('CategoriesUpsertPageComponent', () => {
  let component: CategoriesUpsertPageComponent;
  let fixture: ComponentFixture<CategoriesUpsertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesUpsertPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesUpsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
