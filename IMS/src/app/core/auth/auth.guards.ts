import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { AuthService } from '../../features/auth/auth.services'; // <--- UPDATED IMPORT PATH AND SERVICE NAME

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[];
    console.log(`AuthGuard: canActivate called for route: '${state.url}' requiring roles: ${requiredRoles ? requiredRoles.join(', ') : 'None specified'}.`);

    return this.authService.authStatusReady$.pipe(
      filter(isReady => isReady),
      take(1),
      map(() => {
        const user = this.authService.getCurrentUser();
        const userRole = user ? user.role?.toLowerCase() : null; // Ensure userRole is lowercase or null
        console.log("AuthGuard: Current user from AuthService:", user ? user.role : 'null');
        console.log("AuthGuard: Normalized user role for comparison:", userRole);


        // 1. Check if user is authenticated
        if (!user || !userRole) { // Check userRole as well after normalization
          console.log("AuthGuard: User not authenticated or role missing, redirecting to login.");
          return this.router.createUrlTree(['/home'], { queryParams: { returnUrl: state.url } });
        }

        // 2. Check if roles are specified for this route
        if (!requiredRoles || requiredRoles.length === 0) {
          console.log("AuthGuard: No specific roles required for this route, allowing access.");
          return true; // No roles required, allow access if authenticated
        }

        // 3. Check if the user's role is among the required roles
        const hasRequiredRole = requiredRoles.some(role => role.toLowerCase() === userRole);

        if (hasRequiredRole) {
          console.log(`AuthGuard: User has role '${user.role}', which is in required roles '${requiredRoles.join(', ')}'. Allowing access.`);
          return true;
        } else {
          console.log(`AuthGuard: User role '${user.role}' does not match any of the required roles '${requiredRoles.join(', ')}'. Redirecting.`);
          // Redirect based on the actual user role to their respective dashboard
          switch (userRole) { // userRole is already lowercase here
            case 'admin': // Corrected to lowercase
              return this.router.createUrlTree(['/admin/admin-dashboard']);
            case 'customer': // Corrected to lowercase
              return this.router.createUrlTree(['/customer/customer-dashboard']);
            case 'agent': // Corrected to lowercase
              return this.router.createUrlTree(['/agent/agent-dashboard']);
            default:
              // If the user has an unknown role or no specific redirect, send them to unauthorized or login
              console.warn(`AuthGuard: User with unknown role '${user.role}' or no specific redirect rule. Redirecting to login.`);
              return this.router.createUrlTree(['/home']); // Fallback to login or /unauthorized
          }
        }
      })
    );
  }
}