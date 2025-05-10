import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';

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
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <a routerLink="/" class="logo">
        Zanatli
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
          <ng-container *ngIf="isClient">
            <a mat-button routerLink="/client/dashboard">Dashboard</a>
            <a mat-button routerLink="/client/jobs">My Jobs</a>
          </ng-container>

          <ng-container *ngIf="isContractor">
            <a mat-button routerLink="/contractor">Dashboard</a>
            <a mat-button routerLink="/contractor/jobs">My Jobs</a>
            <a mat-button routerLink="/contractor/profile">Profile</a>
            <a mat-button [routerLink]="'/contractor/profile'" fragment="portfolio">Portfolio</a>
          </ng-container>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
        </ng-container>
      </div>
    </mat-toolbar>

    <!-- Mobile Navigation -->
    <mat-sidenav-container>
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
            <ng-container *ngIf="isClient">
              <a mat-list-item routerLink="/client/dashboard" (click)="sidenav.close()">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/client/jobs" (click)="sidenav.close()">
                <mat-icon>work</mat-icon>
                <span>My Jobs</span>
              </a>
            </ng-container>

            <ng-container *ngIf="isContractor">
              <a mat-list-item routerLink="/contractor" (click)="sidenav.close()">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/contractor/jobs" (click)="sidenav.close()">
                <mat-icon>work</mat-icon>
                <span>My Jobs</span>
              </a>
              <a mat-list-item routerLink="/contractor/profile" (click)="sidenav.close()">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </a>
              <a mat-list-item [routerLink]="'/contractor/profile'" fragment="portfolio" (click)="sidenav.close()">
                <mat-icon>collections</mat-icon>
                <span>Portfolio</span>
              </a>
            </ng-container>

            <a mat-list-item (click)="logout(); sidenav.close()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>
    </mat-sidenav-container>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .logo {
      color: #222;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 500;
      margin-left: 1rem;
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
    }

    mat-sidenav {
      width: 250px;
    }

    mat-nav-list {
      padding-top: 1rem;
    }

    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #222;
    }

    @media (max-width: 768px) {
      .menu-button {
        display: block;
      }

      .desktop-nav {
        display: none;
      }
    }
  `]
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  isClient = false;
  isContractor = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isClient = user?.roles.some(r => r.toLowerCase() === 'client') ?? false;
      this.isContractor = user?.roles.some(r => r.toLowerCase() === 'contractor') ?? false;
    });
  }

  logout() {
    this.authService.logout();
  }
} 