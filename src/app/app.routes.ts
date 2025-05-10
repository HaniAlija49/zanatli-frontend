import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ContractorsSearchComponent } from './contractors/contractors-search/contractors-search.component';
import { ContractorDetailComponent } from './contractors/contractor-detail/contractor-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { 
    path: 'contractors', 
    component: ContractorsSearchComponent 
  },
  { 
    path: 'contractors/:id', 
    component: ContractorDetailComponent 
  },
  { 
    path: 'client', 
    canActivate: [authGuard, () => roleGuard(['Client'])],
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  { 
    path: 'contractor', 
    canActivate: [authGuard, () => roleGuard(['Contractor'])],
    loadChildren: () => import('./features/contractor/contractor.routes').then(m => m.CONTRACTOR_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
