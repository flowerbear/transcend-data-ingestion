import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SourcesComponent } from './sources/sources.component';
import { SourceFormComponent } from './sources/form/form.component';
import { VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [VantageAuthenticationGuard],
    children: [{ path: '', component: DashboardComponent },
               { path: 'sources', children: [
                  { path: '', component: SourcesComponent },
                  { path: 'sources/form', component: SourceFormComponent }]
                }
    ],
  },
  { path: '**', redirectTo: '/' },
];

export const appRoutingProviders: any[] = [VantageAuthenticationGuard];

export const appRoutes: any = RouterModule.forRoot(routes);
