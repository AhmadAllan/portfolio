import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThunderFlash } from './thunder-flash';

describe('ThunderFlash', () => {
  let component: ThunderFlash;
  let fixture: ComponentFixture<ThunderFlash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThunderFlash],
    }).compileComponents();

    fixture = TestBed.createComponent(ThunderFlash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
