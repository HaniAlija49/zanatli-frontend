import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }

      const hasRequiredRole = requiredRoles.some(role =>
        user.roles.some(userRole => userRole.toLowerCase() === role.toLowerCase())
      );
      if (!hasRequiredRole) {
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
}; 