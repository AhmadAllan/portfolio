import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsGrid } from './projects-grid';

describe('ProjectsGrid', () => {
  let component: ProjectsGrid;
  let fixture: ComponentFixture<ProjectsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
