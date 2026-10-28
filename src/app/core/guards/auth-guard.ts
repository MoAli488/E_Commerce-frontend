import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const returnURL = state.url.includes('cart') ? router.url : state.url;

  if (authService.ifAuthorized('user')) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnURL } });
};
