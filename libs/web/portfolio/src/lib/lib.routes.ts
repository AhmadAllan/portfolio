import { Route } from '@angular/router';
import { FeatureShell } from './feature-shell/feature-shell';
import { ProjectDetailComponent } from './project-detail';

export const featureShellRoutes: Route[] = [
  {
    path: '',
    component: FeatureShell,
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      { path: 'about', component: FeatureShell },
      { path: 'experience', component: FeatureShell },
      { path: 'projects', component: FeatureShell },
      { path: 'projects/:id', component: ProjectDetailComponent },
      { path: 'skills', component: FeatureShell },
      { path: 'education', component: FeatureShell },
      { path: 'contact', component: FeatureShell },
    ],
  },
];
