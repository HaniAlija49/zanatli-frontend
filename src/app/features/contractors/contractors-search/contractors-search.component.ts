import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';

@Component({
  selector: 'app-contractors-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="search-container">
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Find Contractors</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Search by name, company, or service">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="Enter location">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Search</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="results-container" *ngIf="contractors.length > 0">
        <mat-card *ngFor="let contractor of contractors" class="contractor-card" [routerLink]="['/contractors', contractor.id]">
          <mat-card-header>
            <mat-card-title>{{contractor.fullName}}</mat-card-title>
            <mat-card-subtitle>{{contractor.companyName}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="location">
              <mat-icon>location_on</mat-icon>
              {{contractor.location}}
            </p>
            <p class="bio">{{contractor.bio}}</p>
            <div class="services">
              <mat-chip *ngFor="let service of contractor.services" color="primary" selected>
                {{service}}
              </mat-chip>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && contractors.length === 0">
        <p>No contractors found. Try adjusting your search criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-card {
      margin-bottom: 2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .results-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .contractor-card {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .contractor-card:hover {
      transform: translateY(-2px);
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      margin: 0.5rem 0;
    }

    .bio {
      margin: 1rem 0;
      color: #333;
    }

    .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class ContractorsSearchComponent implements OnInit {
  searchForm: FormGroup;
  contractors: ContractorProfile[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      location: ['']
    });
  }

  ngOnInit() {
    this.loadContractors();
  }

  loadContractors() {
    this.isLoading = true;
    this.contractorService.getContractors().subscribe({
      next: (contractors) => {
        this.contractors = contractors;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contractors:', error);
        this.snackBar.open('Error loading contractors. Please try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const { search, location } = this.searchForm.value;

      this.contractorService.getContractors().subscribe({
        next: (contractors) => {
          // Filter contractors based on search criteria
          this.contractors = contractors.filter(contractor => {
            const searchMatch = !search || 
              contractor.fullName.toLowerCase().includes(search.toLowerCase()) ||
              contractor.companyName.toLowerCase().includes(search.toLowerCase()) ||
              contractor.services.some(service => service.toLowerCase().includes(search.toLowerCase()));
            
            const locationMatch = !location || 
              contractor.location.toLowerCase().includes(location.toLowerCase());

            return searchMatch && locationMatch;
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching contractors:', error);
          this.snackBar.open('Error searching contractors. Please try again.', 'Close', {
            duration: 5000
          });
          this.isLoading = false;
        }
      });
    }
  }
} 