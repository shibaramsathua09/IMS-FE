//Marks the class as injectable so Angular can provide it via dependency injection.
import { Injectable } from '@angular/core';
/*Imports necessary types for route guarding:
CanActivate: Interface to implement route protection.
ActivatedRouteSnapshot: Info about the route being accessed.
RouterStateSnapshot: Info about the full router state.
UrlTree: Used to redirect the user to another route.*/
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
/*RxJS tools for working with observables:
filter: Wait until a condition is true.
take: Take only the first value.
map: Transform the observable value.*/
import { AuthService } from '../../features/auth/auth.services'; // <--- UPDATED IMPORT PATH AND SERVICE NAME

//'ng generate guard auth' this command to use to create a authentication guard which we use inside the route part
/*Angular does not provide a pre-written AuthGuard service. 
Instead, it provides the CanActivate interface and routing infrastructure so you can write your own guard.
The canActivate method is part of Angular’s CanActivate interface, which is used to control access to routes.
When you add canActivate: [AuthGuard] to a route, Angular calls the canActivate()
method in your guard to decide whether the user can access that route.
*/

/*Make this service available globally in the application, and create only one instance of it.*/
/*the root injector is the top-level dependency injection container that is created when your application starts.
It is responsible for managing and providing singleton services that are available throughout the entire application.

Register this service with the root injector, so it's available everywhere in the app and only one instance is created.
When Angular bootstraps your application (usually in main.ts), it creates the root injector.
This injector is responsible for providing services that are marked with @Injectable({ providedIn: 'root' }).*/
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
  /*Injects AuthService to check login status and user role.
    Injects Router to redirect users if needed.*/
  constructor(private readonly authService: AuthService, private readonly router: Router) {}
/*This method is called when a user tries to access a route.
It returns:
true → allow access
false or UrlTree → block access or redirect*/
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[];
    //Logs which route is being accessed and what roles are required.
    console.log(`AuthGuard: canActivate called for route: '${state.url}' requiring roles: ${requiredRoles ? requiredRoles.join(', ') : 'None specified'}.`);

    /*Waits until the authentication status is ready (e.g., after checking token or session).
Ensures the guard doesn’t run before user info is available.*/
    return this.authService.authStatusReady$.pipe(
      filter(isReady => isReady),
      take(1),
      map(() => {
        /*Gets the current user from AuthService.
          Normalizes the role to lowercase for comparison.*/
        const user = this.authService.getCurrentUser();

       
        const userRole = user ? user.role?.toLowerCase() : null; // Ensure userRole is lowercase or null
        console.log("AuthGuard: Current user from AuthService:", user ? user.role : 'null');
        console.log("AuthGuard: Normalized user role for comparison:", userRole);


        // 1. Check if user is authenticated
        /*If no user or role is found, redirect to /home with a return URL.*/
        if (!user || !userRole) {
          console.log("AuthGuard: User not authenticated or role missing, redirecting to login.");
          return this.router.createUrlTree(['/home'], { queryParams: { returnUrl: state.url } });
        }

        // 2. Check if roles are specified for this route
        if (!requiredRoles || requiredRoles.length === 0) {
          console.log("AuthGuard: No specific roles required for this route, allowing access.");
          return true; // No roles required, allow access if authenticated
        }

        // 3. Check if the user's role is among the required roles
        //Checks if the user’s role matches any of the required roles.
        const hasRequiredRole = requiredRoles.some(role => role.toLowerCase() === userRole);
        /*If the role matches, allow access.
          If not, redirect to the appropriate dashboard based on the user’s role.
          If the role is unknown, redirect to /home.*/
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
