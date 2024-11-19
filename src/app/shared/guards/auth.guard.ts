import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/authorization/auth.service';
import { Route } from '../enums/route.enum';

export const AuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  if (authService.getToken()) {
    // If the token exists, allow access to the route
    return true;
  } else {
    // If the token doesn't exist, redirect to login page
    router
      .navigate([Route.LOGIN], {
        relativeTo: route,
      })
      .then(() => {});;
    return false;
  }
};
