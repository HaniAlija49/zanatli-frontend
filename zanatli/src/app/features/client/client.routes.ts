import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./client-dashboard/client-dashboard.component')
      .then(m => m.ClientDashboardComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./client-jobs/client-jobs.component')
      .then(m => m.ClientJobsComponent)
  }
]; 