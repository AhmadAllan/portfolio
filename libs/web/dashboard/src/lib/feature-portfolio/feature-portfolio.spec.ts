import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePortfolio } from './feature-portfolio';

describe('FeaturePortfolio', () => {
  let component: FeaturePortfolio;
  let fixture: ComponentFixture<FeaturePortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePortfolio],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePortfolio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
