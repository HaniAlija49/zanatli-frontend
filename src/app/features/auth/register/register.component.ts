import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDto } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
            </mat-form-field>

            <div class="role-selection">
              <mat-radio-group formControlName="userType" (change)="onUserTypeChange($event)">
                <mat-radio-button value="client">I want to hire</mat-radio-button>
                <mat-radio-button value="contractor">I want to work</mat-radio-button>
              </mat-radio-group>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
              Register
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .role-selection {
      margin: 1rem 0;
    }
    mat-radio-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    button {
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['', Validators.required],
      isClient: [false],
      isContractor: [false]
    });
  }

  onUserTypeChange(event: any) {
    const userType = event.value;
    this.registerForm.patchValue({
      isClient: userType === 'client',
      isContractor: userType === 'contractor'
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, isClient, isContractor } = this.registerForm.value;
      const registerData: RegisterDto = {
        email,
        password,
        isClient,
        isContractor
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.snackBar.open(error.error.message || 'Registration failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 