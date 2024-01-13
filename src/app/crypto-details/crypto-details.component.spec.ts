import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoDetailsComponent } from './crypto-details.component';

describe('CryptoDetailsComponent', () => {
  let component: CryptoDetailsComponent;
  let fixture: ComponentFixture<CryptoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
