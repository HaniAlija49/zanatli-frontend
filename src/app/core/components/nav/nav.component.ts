import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';
import { RoleToggleComponent } from '../../../shared/components/role-toggle/role-toggle.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    RoleToggleComponent,
    UserMenuComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over">
        <mat-nav-list>
          <a mat-list-item routerLink="/contractors" (click)="sidenav.close()">
            <mat-icon>search</mat-icon>
            <span>Browse Contractors</span>
          </a>
          <ng-container *ngIf="!isLoggedIn">
            <a mat-list-item routerLink="/auth/login" (click)="sidenav.close()" class="black-text">
              <mat-icon>login</mat-icon>
              <span>Login</span>
            </a>
            <a mat-list-item routerLink="/auth/register" (click)="sidenav.close()" class="black-text">
              <mat-icon>person_add</mat-icon>
              <span>Sign Up</span>
            </a>
          </ng-container>

          <ng-container *ngIf="isLoggedIn">
            <ng-container *ngIf="activeRole === 'client'">
              <a mat-list-item routerLink="/client" (click)="sidenav.close()">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/client/jobs" (click)="sidenav.close()">
                <mat-icon>work</mat-icon>
                <span>My Jobs</span>
              </a>
            </ng-container>

            <ng-container *ngIf="activeRole === 'contractor'">
              <a mat-list-item routerLink="/contractor" (click)="sidenav.close()">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/contractor/jobs" (click)="sidenav.close()">
                <mat-icon>work</mat-icon>
                <span>My Jobs</span>
              </a>
              <a mat-list-item [routerLink]="'/contractor/profile'" fragment="portfolio" (click)="sidenav.close()">
                <mat-icon>collections</mat-icon>
                <span>Portfolio</span>
              </a>
            </ng-container>

            <div class="mobile-role-toggle" *ngIf="(roles || []).length > 1">
              <app-role-toggle
                [roles]="roles"
                [activeRole]="activeRole"
                (roleChange)="onRoleChange($event)"
              ></app-role-toggle>
            </div>

            <button mat-list-item *ngIf="isLoggedIn && roles.includes('client') && !roles.includes('contractor')" (click)="confirmBecomeContractor(); sidenav.close()">
              <mat-icon>engineering</mat-icon>
              <span>Be a Contractor</span>
            </button>

            <a mat-list-item (click)="logout(); sidenav.close()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>

          <a routerLink="/" class="logo">
            <span class="logo-text">Zanatly</span>
            <span class="logo-tagline">Find Your Perfect Contractor</span>
          </a>

          <span class="spacer"></span>

          <!-- Desktop Navigation -->
          <div class="desktop-nav">
            <a mat-button routerLink="/contractors">Browse Contractors</a>
            <ng-container *ngIf="!isLoggedIn">
              <a mat-button routerLink="/auth/login" class="black-text">Login</a>
              <a mat-raised-button color="accent" routerLink="/auth/register" class="black-text">Sign Up</a>
            </ng-container>

            <ng-container *ngIf="isLoggedIn">
              <ng-container *ngIf="activeRole === 'client'">
                <a mat-button routerLink="/client">Dashboard</a>
                <a mat-button routerLink="/client/jobs">My Jobs</a>
              </ng-container>

              <ng-container *ngIf="activeRole === 'contractor'">
                <a mat-button routerLink="/contractor">Dashboard</a>
                <a mat-button routerLink="/contractor/jobs">My Jobs</a>
                <a mat-button [routerLink]="'/contractor/profile'" fragment="portfolio">Portfolio</a>
              </ng-container>

              <app-role-toggle
                [roles]="roles"
                [activeRole]="activeRole"
                (roleChange)="onRoleChange($event)"
                *ngIf="(roles || []).length > 1"
              ></app-role-toggle>

              <button mat-stroked-button color="primary" *ngIf="isLoggedIn && roles.includes('client') && !roles.includes('contractor')" (click)="confirmBecomeContractor()">
                <mat-icon>engineering</mat-icon>
                Be a Contractor
              </button>

              <app-user-menu></app-user-menu>
            </ng-container>
          </div>
        </mat-toolbar>
        <div class="content-wrapper">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .logo {
      color: #222;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
      margin-left: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .logo-text {
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 1.8rem;
      letter-spacing: -0.5px;
    }

    .logo-tagline {
      font-size: 0.7rem;
      color: #666;
      font-weight: 400;
      margin-top: -2px;
    }

    .menu-button {
      display: none;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .desktop-nav a {
      color: #222;
      text-decoration: none;
    }

    .desktop-nav a[mat-raised-button] {
      color: #222;
      background: #ffe082;
    }

    .black-text {
      color: #222 !important;
    }

    mat-toolbar {
      color: #222;
      background: #fff;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
    }

    mat-sidenav {
      width: 280px;
    }

    .content-wrapper {
      padding-top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
      background-color: #f5f5f5;
    }

    mat-nav-list {
      padding-top: 1rem;
    }

    mat-nav-list a, mat-nav-list button {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #222;
      height: 48px;
      padding: 0 16px;
    }

    mat-nav-list mat-icon {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .mobile-role-toggle {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      background-color: #f5f5f5;
    }

    .mobile-role-toggle app-role-toggle {
      display: flex;
      justify-content: center;
      padding: 8px 0;
    }

    .mobile-role-toggle::before {
      content: 'Switch Role';
      display: block;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .menu-button {
        display: block;
        margin-right: 8px;
      }

      .desktop-nav {
        display: none;
      }

      mat-nav-list a, mat-nav-list button {
        padding: 0 24px;
      }

      mat-nav-list mat-icon {
        margin-right: 16px;
      }

      .logo {
        font-size: 1.2rem;
      }
    }
  `]
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  roles: string[] = [];
  activeRole: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.roles = Array.isArray(user?.roles) ? user.roles : [];
      this.activeRole = user?.activeRole ?? '';
    });
    this.authService.activeRole$.subscribe(role => {
      this.activeRole = role;
    });
    this.authService.roles$.subscribe(roles => {
      this.roles = Array.isArray(roles) ? roles : [];
    });
  }

  onRoleChange(role: string) {
    this.authService.setActiveRole(role);
    if (role === 'client') {
      this.router.navigate(['/client/dashboard']);
    } else if (role === 'contractor') {
      this.router.navigate(['/contractor/dashboard']);
    }
  }

  logout() {
    this.authService.logout();
  }

  confirmBecomeContractor() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Become a Contractor',
        message: 'Are you sure you want to become a contractor? This will allow you to offer your services to clients.',
        confirmText: 'Yes, Become a Contractor',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.becomeContractor();
      }
    });
  }

  becomeContractor() {
    this.authService.assignContractorRole().subscribe({
      next: () => {
        this.snackBar.open('You are now a contractor! Toggle your role to access contractor features.', 'Close', { duration: 5000 });
      },
      error: () => {
        this.snackBar.open('Failed to assign contractor role. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }
} 