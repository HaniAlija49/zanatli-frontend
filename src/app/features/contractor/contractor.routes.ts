import { Routes } from '@angular/router';

export const CONTRACTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./contractor-dashboard/contractor-dashboard.component')
      .then(m => m.ContractorDashboardComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./contractor-jobs/contractor-jobs.component')
      .then(m => m.ContractorJobsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./contractor-profile/contractor-profile.component')
      .then(m => m.ContractorProfileComponent)
  }
]; 