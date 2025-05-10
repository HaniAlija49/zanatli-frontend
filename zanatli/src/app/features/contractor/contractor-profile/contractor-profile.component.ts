import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../../../core/models/contractor.models';

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
    MatIconModule
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
              <mat-label>Services (comma-separated)</mat-label>
              <input matInput formControlName="services" required>
              <mat-error *ngIf="profileForm.get('services')?.hasError('required')">
                At least one service is required
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid">
                {{isEditing ? 'Update Profile' : 'Create Profile'}}
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
  `]
})
export class ContractorProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  profile: ContractorProfile | null = null;

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      bio: [''],
      services: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.contractorService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isEditing = true;
        this.profileForm.patchValue({
          fullName: profile.fullName,
          companyName: profile.companyName,
          location: profile.location,
          bio: profile.bio,
          services: Array.isArray(profile.services) ? profile.services.join(', ') : ''
        });
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const data = {
        ...formValue,
        services: formValue.services.split(',').map((s: string) => s.trim())
      };

      if (this.isEditing) {
        this.contractorService.updateProfile(data as UpdateContractorProfileDto).subscribe({
          next: () => {
            // TODO: Show success message
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          }
        });
      } else {
        this.contractorService.createProfile(data as CreateContractorProfileDto).subscribe({
          next: () => {
            // TODO: Show success message
          },
          error: (error) => {
            console.error('Error creating profile:', error);
          }
        });
      }
    }
  }
} 