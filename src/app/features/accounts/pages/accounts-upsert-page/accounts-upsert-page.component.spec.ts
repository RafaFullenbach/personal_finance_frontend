import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsUpsertPageComponent } from './accounts-upsert-page.component';

describe('AccountsUpsertPageComponent', () => {
  let component: AccountsUpsertPageComponent;
  let fixture: ComponentFixture<AccountsUpsertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsUpsertPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsUpsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
