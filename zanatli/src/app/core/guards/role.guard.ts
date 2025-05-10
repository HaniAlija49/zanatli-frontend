import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (allowedRoles: ('Client' | 'Contractor')[]) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && allowedRoles.includes(user.activeRole)) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
}; 