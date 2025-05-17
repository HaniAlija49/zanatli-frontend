import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';
import { PhotoService, Photo } from '../../../core/services/photo.service';
import { HostListener } from '@angular/core';

interface PaginatedResponse {
  totalCount: number;
  items: ContractorProfile[];
}

@Component({
  selector: 'app-contractors-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="search-container">
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Find Contractors</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-bar-flex">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Name, company, or service">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="Location">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Price Level</mat-label>
              <mat-select formControlName="priceLevels" multiple>
                <mat-option value="1">$</mat-option>
                <mat-option value="2">$$</mat-option>
                <mat-option value="3">$$$</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="isLoading" class="search-btn">
              <mat-icon>search</mat-icon>
              <span>Search</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="controls-container">
        <div class="view-controls">
          <mat-form-field appearance="outline" class="sort-field">
            <mat-label>Sort by</mat-label>
            <mat-select [(ngModel)]="sortBy" (selectionChange)="onSortChange()">
              <mat-option value="rating">Rating (High to Low)</mat-option>
              <mat-option value="price_asc">Price (Low to High)</mat-option>
              <mat-option value="price_desc">Price (High to Low)</mat-option>
              <mat-option value="name_asc">Name (A to Z)</mat-option>
              <mat-option value="name_desc">Name (Z to A)</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-button-toggle-group [(ngModel)]="viewMode" (change)="onViewModeChange()">
            <mat-button-toggle value="cards">
              <mat-icon>grid_view</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="rows">
              <mat-icon>view_list</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <div class="results-container" [ngClass]="viewMode" *ngIf="contractors.length > 0">
        <mat-card *ngFor="let contractor of contractors" class="contractor-card">
          <div class="card-header-flex">
            <div class="profile-img-wrapper">
              <img class="profile-img" [src]="contractorPhotos[contractor.id] || 'assets/images/default-profile.png'" alt="Profile" />
            </div>
          </div>
          <div class="card-content-flex">
            <div class="name-row">
              <span class="contractor-name">{{contractor.fullName}}</span>
              <span class="company">{{contractor.companyName}}</span>
            </div>
            <div class="info-row">
              <div class="rating" *ngIf="contractor.averageRating">
                <mat-icon>star</mat-icon>
                <span>{{contractor.averageRating.toFixed(1)}} <span class="review-count">({{contractor.reviewCount || 0}} {{contractor.reviewCount === 1 ? 'review' : 'reviews'}})</span></span>
              </div>
              <div class="info-badges">
                <div class="location-badge">
                  <mat-icon>location_on</mat-icon>
                  <span>{{contractor.location}}</span>
                </div>
                <div class="price-level">
                  <span class="label">Price:</span>
                  <span class="value">{{ contractor.priceLevel ? '$'.repeat(contractor.priceLevel) : '-' }}</span>
                </div>
              </div>
            </div>
            <div class="bio" [matTooltip]="contractor.bio" [matTooltipDisabled]="!(contractor.bio && (contractor.bio.length || 0) > 120)">
              {{ (contractor.bio.length || 0) > 120 ? (contractor.bio | slice:0:120) + '...' : contractor.bio }}
            </div>
            <div class="services">
              <mat-chip *ngFor="let service of contractor.services.slice(0,3)" color="primary" selected>
                <span class="chip-content">
                  <mat-icon class="service-icon">build</mat-icon>
                  {{ service }}
                </span>
              </mat-chip>
              <span *ngIf="contractor.services.length > 3" class="more-services">+{{contractor.services.length - 3}} more</span>
            </div>
            <div class="actions">
              <a mat-flat-button color="accent" [routerLink]="['/contractors', contractor.id]">
                <mat-icon>visibility</mat-icon>
                View Profile
              </a>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && contractors.length === 0">
        <p>No contractors found. Try adjusting your search criteria.</p>
      </div>

      <mat-paginator
        [length]="totalItems"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (page)="onPageChange($event)"
        aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .controls-container {
      margin: 1rem 0;
      padding: 0 1rem;
    }

    .view-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .sort-field {
      width: 220px;
      margin: 0;
    }

    .sort-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .results-container {
      margin: 2rem 0;
    }

    .results-container.cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .results-container.cards .contractor-card {
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      transition: box-shadow 0.2s, transform 0.2s;
      padding-bottom: 1rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      min-height: 320px;
      position: relative;
      height: 100%;
    }

    .results-container.cards .contractor-card:hover {
      box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
      transform: translateY(-4px) scale(1.02);
    }

    .results-container.cards .card-header-flex {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.8rem;
    }

    .results-container.cards .profile-img-wrapper {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border: 3px solid #fff;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .results-container.cards .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .results-container.cards .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .results-container.cards .name-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .results-container.cards .contractor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #222;
    }

    .results-container.cards .company {
      font-size: 1rem;
      color: #1976d2;
      font-weight: 500;
    }

    .results-container.cards .info-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .results-container.cards .info-badges {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex-wrap: wrap;
    }

    .results-container.cards .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffc107;
      font-size: 1rem;
      margin: 0;
      padding: 0;
    }

    .results-container.cards .rating .review-count {
      color: #666;
      font-size: 0.9em;
      margin-left: 0.2em;
    }

    .results-container.cards .location-badge,
    .results-container.cards .price-level {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      border-radius: 8px;
      padding: 0.3rem 0.8rem;
      font-size: 0.95rem;
      height: 32px;
      box-sizing: border-box;
      line-height: 1;
      white-space: nowrap;
      margin: 0;
    }

    .results-container.cards .location-badge {
      background: #e3f2fd;
      color: #1976d2;
    }

    .results-container.cards .price-level {
      background: #e8f5e9;
      color: #4CAF50;
    }

    .results-container.cards .price-level .label {
      color: #666;
      font-weight: 500;
    }

    .results-container.cards .price-level .value {
      color: #4CAF50;
      font-weight: 600;
    }

    .results-container.cards .location-badge mat-icon,
    .results-container.cards .price-level mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .results-container.cards .bio {
      margin: 1.2rem 0 0.7rem 0;
      color: #444;
      font-size: 1.05rem;
      min-height: 2.5em;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .results-container.cards .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.2rem;
    }

    .results-container.cards .chip-content {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .results-container.cards .service-icon {
      font-size: 16px;
      padding-top: 8px;
    }

    .results-container.cards .more-services {
      color: #1976d2;
      font-weight: 500;
      margin-left: 0.5rem;
      font-size: 0.98rem;
      align-self: center;
    }

    .results-container.cards .card-content-flex {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0 1.5rem;
    }

    .results-container.cards .actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
      padding: 0 1.5rem 1rem 1.5rem;
    }

    .results-container.cards .actions a[mat-flat-button] {
      font-weight: 600;
      font-size: 1.05rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0.6rem 1.5rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
    }

    .results-container.cards .actions a[mat-flat-button]:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }

    .results-container.rows {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .results-container.rows .contractor-card {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      padding: 0;
      gap: 0;
      border-radius: 12px;
      overflow: hidden;
      height: 180px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .results-container.rows .card-header-flex {
      flex: 0 0 240px;
      border: none;
      padding: 0;
      background: #f8f9fa;
      position: relative;
    }

    .results-container.rows .card-header-flex::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #e0e0e0;
    }

    .results-container.rows .profile-img-wrapper {
      width: 100%;
      height: 100%;
      border-radius: 0 !important;
      overflow: hidden;
      border: none !important;
    }

    .results-container.rows .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0 !important;
    }

    .results-container.rows .card-content-flex {
      flex: 1;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: white;
      position: relative;
    }

    .results-container.rows .name-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-bottom: 0.25rem;
    }

    .results-container.rows .contractor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #222;
    }

    .results-container.rows .company {
      font-size: 1rem;
      color: #1976d2;
      font-weight: 500;
    }

    .results-container.rows .info-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .results-container.rows .info-badges {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex-wrap: wrap;
    }

    .results-container.rows .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffc107;
      font-size: 1rem;
      margin: 0;
      padding: 0;
    }

    .results-container.rows .rating .review-count {
      color: #666;
      font-size: 0.9em;
      margin-left: 0.2em;
    }

    .results-container.rows .location-badge,
    .results-container.rows .price-level {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      border-radius: 8px;
      padding: 0.3rem 0.8rem;
      font-size: 0.95rem;
      height: 32px;
      box-sizing: border-box;
      line-height: 1;
      white-space: nowrap;
      margin: 0;
    }

    .results-container.rows .location-badge {
      background: #e3f2fd;
      color: #1976d2;
    }

    .results-container.rows .price-level {
      background: #e8f5e9;
      color: #4CAF50;
    }

    .results-container.rows .price-level .label {
      color: #666;
      font-weight: 500;
    }

    .results-container.rows .price-level .value {
      color: #4CAF50;
      font-weight: 600;
    }

    .results-container.rows .location-badge mat-icon,
    .results-container.rows .price-level mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .results-container.rows .bio {
      margin: 0;
      font-size: 1rem;
      line-height: 1.4;
      color: #444;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .results-container.rows .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0;
      margin-bottom: 0.5rem;
    }

    .results-container.rows .services mat-chip {
      font-size: 0.9rem;
      padding: 0.3rem 0.6rem;
      height: 28px;
    }

    .results-container.rows .services .chip-content {
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }

    .results-container.rows .services .service-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .results-container.rows .more-services {
      color: #1976d2;
      font-weight: 500;
      font-size: 0.9rem;
      align-self: center;
    }

    .results-container.rows .actions {
      position: absolute;
      bottom: 1.25rem;
      right: 1.25rem;
      display: flex;
      justify-content: flex-end;
    }

    .results-container.rows .actions a[mat-flat-button] {
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0.5rem 1.25rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
    }

    .results-container.rows .actions a[mat-flat-button]:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }

    mat-paginator {
      margin-top: 2rem;
      background: transparent;
    }

    .search-card {
      margin-bottom: 2rem;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    }

    .search-bar-flex {
      display: flex;
      align-items: stretch;
      gap: 1.2rem;
      background: #f5faff;
      border-radius: 12px;
      padding: 1.2rem 1rem 1rem 1rem;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.04);
      flex-wrap: nowrap;
    }
    .search-field {
      flex: 1 1 0;
      min-width: 180px;
      margin-bottom: 0;
    }
    .search-btn {
      height: 56px;
      align-self: stretch;
      font-weight: 600;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0 1.5rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      margin-bottom: 0;
    }
    .search-btn:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }

    .contractor-card {
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      transition: box-shadow 0.2s, transform 0.2s;
      padding-bottom: 1rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      min-height: 320px;
      position: relative;
      height: 100%;
    }
    .contractor-card:hover {
      box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
      transform: translateY(-4px) scale(1.02);
    }

    .card-header-flex {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.8rem;
    }
    .profile-img-wrapper {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border: 3px solid #fff;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .name-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .contractor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #222;
    }
    .company {
      font-size: 1rem;
      color: #1976d2;
      font-weight: 500;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffc107;
      font-size: 1rem;

      mat-icon {
        color: #ffc107;
      }

      .review-count {
        color: #666;
        font-size: 0.9em;
        margin-left: 0.2em;
      }
    }
    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      padding: 0.2rem 0.7rem 0.2rem 0.5rem;
      font-size: 0.98rem;
      margin-top: 0.2rem;
      width: fit-content;
    }
    .price-level {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #e8f5e9;
      color: #4CAF50;
      border-radius: 12px;
      padding: 0.2rem 0.7rem 0.2rem 0.5rem;
      font-size: 0.98rem;
      margin-top: 0.2rem;
      width: fit-content;

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #4CAF50;
        font-weight: 600;
      }
    }
    .price-level mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .bio {
      margin: 1.2rem 0 0.7rem 0;
      color: #444;
      font-size: 1.05rem;
      min-height: 2.5em;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.2rem;
    }

    .chip-content {
      display: flex;
      align-items: center; /* ✅ vertical alignment fix */
      gap: 0.3rem;
    }

    .service-icon {
      font-size: 16px;
      padding-top: 8px;
    }
    .more-services {
      color: #1976d2;
      font-weight: 500;
      margin-left: 0.5rem;
      font-size: 0.98rem;
      align-self: center;
    }
    .card-content-flex {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
      padding: 0 1.5rem 1rem 1.5rem;
    }
    .actions a[mat-flat-button] {
      font-weight: 600;
      font-size: 1.05rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0.6rem 1.5rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
    }
    .actions a[mat-flat-button]:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
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
    @media (max-width: 900px) {
      .results-container {
        grid-template-columns: 1fr;
      }
      .contractor-card {
        min-width: 0;
      }
      .search-bar-flex {
        flex-direction: column;
        gap: 0.7rem;
        flex-wrap: wrap;
      }
      .search-btn {
        width: 100%;
        height: 48px;
        min-width: 0;
      }
    }
    @media (max-width: 600px) {
      .search-container {
        padding: 0.5rem;
      }
      .card-header-flex {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 0.5rem 0 0.5rem;
      }
      .profile-img-wrapper {
        width: 64px;
        height: 64px;
      }
      .header-info {
        gap: 0.3rem;
      }
      .bio {
        font-size: 0.98rem;
      }
      .actions a[mat-flat-button] {
        font-size: 0.98rem;
        padding: 0.5rem 1rem;
      }
    }
    @media (max-width: 768px) {
      .view-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }

      .sort-field {
        width: 100%;
      }

      .mat-button-toggle-group {
        display: none; /* Hide view toggle on mobile */
      }

      .results-container.cards {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .results-container.cards .contractor-card {
        min-height: auto;
        height: auto;
      }

      .results-container.cards .card-header-flex {
        padding: 1rem 1rem 0.5rem 1rem;
        gap: 1rem;
      }

      .results-container.cards .profile-img-wrapper {
        width: 70px;
        height: 70px;
      }

      .results-container.cards .contractor-name {
        font-size: 1.1rem;
      }

      .results-container.cards .company {
        font-size: 0.95rem;
      }

      .results-container.cards .bio {
        font-size: 0.95rem;
        margin: 0.8rem 0 0.5rem 0;
      }

      .results-container.cards .services {
        gap: 0.3rem;
        margin-bottom: 0.8rem;
      }

      .results-container.cards .services mat-chip {
        font-size: 0.85rem;
        padding: 0.2rem 0.5rem;
        height: 24px;
      }

      .results-container.cards .actions {
        padding: 0 1rem 0.8rem 1rem;
      }

      .results-container.cards .actions a[mat-flat-button] {
        font-size: 0.95rem;
        padding: 0.4rem 1rem;
      }

      .search-container {
        padding: 1rem;
      }

      .search-card {
        margin-bottom: 1rem;
      }

      .search-bar-flex {
        padding: 0.8rem;
        gap: 0.8rem;
      }

      .search-field {
        min-width: 0;
      }

      .search-btn {
        height: 48px;
        padding: 0 1rem;
      }
    }
  `]
})
export class ContractorsSearchComponent implements OnInit {
  searchForm: FormGroup;
  contractors: ContractorProfile[] = [];
  contractorPhotos: { [contractorId: number]: string } = {};
  isLoading = false;
  viewMode: 'cards' | 'rows' = 'cards';
  pageSize = 10;
  currentPage = 0;
  totalItems = 0;
  sortBy = 'rating';

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService,
    private photoService: PhotoService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      location: [''],
      priceLevels: [[]]
    });
  }

  ngOnInit() {
    this.loadContractors();
    // Set initial view mode based on screen size
    if (window.innerWidth <= 768) {
      this.viewMode = 'cards';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Force card view on mobile when window is resized
    if (window.innerWidth <= 768) {
      this.viewMode = 'cards';
    }
  }

  onSortChange() {
    this.contractors.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price_asc':
          return (a.priceLevel || 0) - (b.priceLevel || 0);
        case 'price_desc':
          return (b.priceLevel || 0) - (a.priceLevel || 0);
        case 'name_asc':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'name_desc':
          return (b.fullName || '').localeCompare(a.fullName || '');
        default:
          return 0;
      }
    });
  }

  loadContractors(service?: string, location?: string, priceLevels?: number[]) {
    this.isLoading = true;
    this.contractorService.getContractors(
      service, 
      location, 
      priceLevels,
      this.currentPage + 1,
      this.pageSize
    ).subscribe({
      next: (response: PaginatedResponse) => {
        const contractors = response.items;
        this.contractors = contractors.map((contractor: ContractorProfile) => {
          if (typeof contractor.services === 'string') {
            contractor.services = (contractor.services as string).split(',').map((s: string) => s.trim());
          }
          return contractor;
        });
        this.totalItems = response.totalCount;
        this.loadProfilePhotos(this.contractors);
        this.onSortChange(); // Apply initial sort
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

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadContractors(
      this.searchForm.get('search')?.value,
      this.searchForm.get('location')?.value,
      this.searchForm.get('priceLevels')?.value
    );
  }

  onViewModeChange() {
    // Force card view on mobile
    if (window.innerWidth <= 768) {
      this.viewMode = 'cards';
    }
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.currentPage = 0; // Reset to first page on new search
      this.loadContractors(
        this.searchForm.get('search')?.value,
        this.searchForm.get('location')?.value,
        this.searchForm.get('priceLevels')?.value
      );
    }
  }

  loadProfilePhotos(contractors: ContractorProfile[]) {
    contractors.forEach(contractor => {
      this.photoService.getContractorPhotos(contractor.id).subscribe({
        next: (photos) => {
          const profilePhoto = photos.find(photo => photo.type === 0);
          if (profilePhoto) {
            this.contractorPhotos[contractor.id] = profilePhoto.url;
          }
        },
        error: () => {
          // Ignore photo errors, fallback to default
        }
      });
    });
  }
} 