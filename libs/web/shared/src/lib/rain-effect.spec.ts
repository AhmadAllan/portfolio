import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RainEffect } from './rain-effect';

describe('RainEffect', () => {
  let component: RainEffect;
  let fixture: ComponentFixture<RainEffect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainEffect],
    }).compileComponents();

    fixture = TestBed.createComponent(RainEffect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
