import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token is invalid or expired
        authService.logout();
        snackBar.open('Your session has expired. Please login again.', 'Close', {
          duration: 5000
        });
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
}; 