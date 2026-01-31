import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalCard } from './portal-card';

describe('PortalCard', () => {
  let component: PortalCard;
  let fixture: ComponentFixture<PortalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
