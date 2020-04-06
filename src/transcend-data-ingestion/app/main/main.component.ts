import { Component, OnInit } from '@angular/core';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';
import { IUser } from '@td-vantage/ui-platform/user';
import { VantageSessionService } from '@td-vantage/ui-platform/auth';
import { ITdLink } from '@covalent/core/nav-links';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  // Logged in user
  user: IUser;
  // Year for COPYRIGHT
  year: any = new Date().getFullYear();
  // Sidenav routes
  links: ITdLink[] = [
    {
      label: 'Overview',
      link: {
        routerLink: '/',
      },
      icon: {
        name: 'dashboard',
      },
      show: true,
    },
    {
      label: 'Manage Source Connectors',
      link: {
      routerLink: '/sources',
      },
      icon: {
        name: 'settings_input_antenna',
      },
      show: true,
    },
    {
      label: 'Manage Connect Cluster',
      link: {
        routerLink: '/',
      },
      icon: {
        name: 'dns',
      },
      show: true,
    },
    {
      label: 'Manage User',
      link: {
        routerLink: '/',
      },
      icon: {
        name: 'people',
      },
      show: true,
    },
    {
      label: 'Administration',
      link: {
        routerLink: '/',
      },
      icon: {
        name: 'verified_user',
      },
      show: true,
    },
  ];

  constructor(private _vantageSessionService: VantageSessionService, public _themeService: VantageThemeService) {}

  ngOnInit(): void {
    this.user = this._vantageSessionService.user;
  }

  logout(): void {
    this.user = undefined;
    this._vantageSessionService.logout();
  }
}
