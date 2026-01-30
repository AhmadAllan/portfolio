import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BioSection } from './bio-section';

describe('BioSection', () => {
  let component: BioSection;
  let fixture: ComponentFixture<BioSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioSection],
    }).compileComponents();

    fixture = TestBed.createComponent(BioSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
