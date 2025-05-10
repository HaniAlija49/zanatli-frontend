import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../../../core/models/contractor.models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-contractor-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit Profile' : 'Create Profile'}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required>
              <mat-error *ngIf="profileForm.get('fullName')?.hasError('required')">
                Full name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Company Name</mat-label>
              <input matInput formControlName="companyName" required>
              <mat-error *ngIf="profileForm.get('companyName')?.hasError('required')">
                Company name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" required>
              <mat-error *ngIf="profileForm.get('location')?.hasError('required')">
                Location is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Bio</mat-label>
              <textarea matInput formControlName="bio" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Services</mat-label>
              <mat-chip-grid #chipGrid aria-label="Enter services">
                <mat-chip-row
                  *ngFor="let service of services"
                  (removed)="removeService(service)">
                  {{service}}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
                <input placeholder="New service..."
                       [matChipInputFor]="chipGrid"
                       [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                       (matChipInputTokenEnd)="addService($event)">
              </mat-chip-grid>
              <mat-error *ngIf="profileForm.get('services')?.hasError('required')">
                At least one service is required
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="profileForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">{{isEditing ? 'Update Profile' : 'Create Profile'}}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class ContractorProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  profile: ContractorProfile | null = null;
  services: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', Validators.maxLength(500)],
      services: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.contractorService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isEditing = true;
        this.services = profile.services;
        this.profileForm.patchValue({
          fullName: profile.fullName,
          companyName: profile.companyName,
          location: profile.location,
          bio: profile.bio,
          services: profile.services
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Error loading profile. Please try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  addService(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.services.push(value);
      this.profileForm.patchValue({ services: this.services });
    }
    event.chipInput!.clear();
  }

  removeService(service: string): void {
    const index = this.services.indexOf(service);
    if (index >= 0) {
      this.services.splice(index, 1);
      this.profileForm.patchValue({ services: this.services });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const data = {
        ...this.profileForm.value,
        services: this.services
      };

      const request$ = this.isEditing
        ? this.contractorService.updateProfile(data as UpdateContractorProfileDto)
        : this.contractorService.createProfile(data as CreateContractorProfileDto);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Profile ${this.isEditing ? 'updated' : 'created'} successfully!`,
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        },
        error: (error) => {
          console.error(`Error ${this.isEditing ? 'updating' : 'creating'} profile:`, error);
          this.snackBar.open(
            `Error ${this.isEditing ? 'updating' : 'creating'} profile. Please try again.`,
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
} 