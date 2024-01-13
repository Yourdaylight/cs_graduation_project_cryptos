import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoComponent } from './crypto.component';

describe('CryptoComponent', () => {
  let component: CryptoComponent;
  let fixture: ComponentFixture<CryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
