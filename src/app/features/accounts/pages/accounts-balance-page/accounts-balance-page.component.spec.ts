import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsBalancePageComponent } from './accounts-balance-page.component';

describe('AccountsBalancePageComponent', () => {
  let component: AccountsBalancePageComponent;
  let fixture: ComponentFixture<AccountsBalancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsBalancePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsBalancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
