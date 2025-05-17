import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    data: { roles: ['client'] },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/client/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/client/client-jobs/client-jobs.component').then(m => m.ClientJobsComponent)
      },
      {
        path: 'jobs/:jobId/messages',
        loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent)
      }
    ]
  },
  {
    path: 'contractor',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    data: { roles: ['contractor'] },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/contractor/contractor-dashboard/contractor-dashboard.component').then(m => m.ContractorDashboardComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/contractor/contractor-jobs/contractor-jobs.component').then(m => m.ContractorJobsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/contractor/contractor-profile/contractor-profile.component').then(m => m.ContractorProfileComponent)
      },
      {
        path: 'jobs/:jobId/messages',
        loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent)
      }
    ]
  },
  {
    path: 'contractors',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/contractors/contractors-search/contractors-search.component').then(m => m.ContractorsSearchComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/contractors/contractor-detail/contractor-detail.component').then(m => m.ContractorDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
