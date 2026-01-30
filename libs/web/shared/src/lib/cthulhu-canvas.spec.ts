import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CthulhuCanvas } from './cthulhu-canvas';

describe('CthulhuCanvas', () => {
  let component: CthulhuCanvas;
  let fixture: ComponentFixture<CthulhuCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CthulhuCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(CthulhuCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
