import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiebaComponent } from './tieba.component';

describe('TiebaComponent', () => {
  let component: TiebaComponent;
  let fixture: ComponentFixture<TiebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiebaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
