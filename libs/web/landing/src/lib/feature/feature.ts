import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LandingHeroComponent } from '../landing-hero';
import { BioSectionComponent } from '../bio-section';
import { PortalCardComponent } from '../portal-card';
import { SocialLinksComponent } from '../social-links';
import { LoginButtonComponent } from '../login-button';

@Component({
  selector: 'lib-feature',
  imports: [
    CommonModule,
    RouterLink,
    LandingHeroComponent,
    BioSectionComponent,
    PortalCardComponent,
    SocialLinksComponent,
    LoginButtonComponent
  ],
  templateUrl: './feature.html',
  styleUrl: './feature.css',
})
export class Feature {}
