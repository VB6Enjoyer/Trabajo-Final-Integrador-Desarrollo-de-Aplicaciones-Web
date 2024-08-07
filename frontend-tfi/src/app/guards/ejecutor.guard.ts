import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RolesEnum } from '../enums/roles.enum';
import { AuthService } from '../services/auth.service';

export const ejecutorGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  if (!service.isLoggedIn()) {
    inject(Router).navigateByUrl('login');
  }
  if (!service.hasRole(RolesEnum.EJECUTOR)) {
    inject(Router).navigateByUrl('login');
  }
  return true;
};