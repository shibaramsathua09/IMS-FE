import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

import { Component } from '@angular/core';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PolicyManagementComponent } from './features/admin/policy-management/policy-management.component';
import { RegistrationFormComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/Home/home-dashboard/home-dashboard.component';
import { AgentLayoutComponent } from './layouts/agent-layout/agent-layout.component';


import { AgentDashboardComponent } from './features/agent/agent-dashboard/agent-dashboard.component';

import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { CustomerManagementComponent } from './features/admin/customer-management/customer-management.component';
import { ClaimManagementComponent } from './features/admin/claim-management/claim-management.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AgentManagementComponent } from './features/admin/agent-management/agent-management.component';
import { AddAgentComponent } from './features/admin/add-agent/add-agent.component';
import { AvailablePoliciesComponent } from './features/customer/available-policies/available-policies.component';
import{CustomerClaimsComponent} from './features/customer/customer-claims/customer-claims.component';
import { CustomerRegisteredPoliciesComponent } from './features/customer/customer-registered-policies/customer-registered-policies.component';
import { CustomerNotificationsComponent } from './features/customer/customer-notifications/customer-notifications.component';
import { CustomerProfileComponent } from './features/customer/customer-profile/customer-profile.component';
import { FileClaimComponent } from './features/customer/file-claim/file-claim.component';
import { RequestNewPolicyComponent } from './features/customer/request-new-policy/request-new-policy.component';
import { CreatePolicyComponent } from './features/admin/policy-management/create-policy/create-policy.component';
import { UpdatePolicyComponent } from './features/admin/policy-management/update-policy/update-policy.component';
import { ViewAllPoliciesComponent } from './features/admin/policy-management/view-all-policies/view-all-policies.component';
import { PolicyRequestsComponent } from './features/customer/policy-requests/policy-requests.component';
import { RequestedPoliciesComponent } from './features/admin/policy-management/requested-policies/requested-policies.component';
import { AssignedPoliciesComponent } from './features/agent/assigned-policies/assigned-policies.component';
import { AgentAvailablePoliciesComponent } from './features/agent/agent-available-policies/agent-available-policies.component';
import { FiledClaimsComponent } from './features/agent/filed-claims/filed-claims.component';
import { AgentNotificationsComponent } from './features/agent/agent-notifications/agent-notifications.component';
import { FileAClaimComponent } from './features/agent/file-a-claim/file-a-claim.component';
import { AgentProfileComponent } from './features/agent/agent-profile/agent-profile.component';
import { AuthGuard } from './core/auth/auth.guards';

export const routes: Routes = [

  
  /*path: '': This matches the root URL of your application (i.e., when someone visits http://yourdomain.com/).
  redirectTo: '/home': It tells Angular to redirect the user to the /home route.
  pathMatch: 'full': This ensures that the redirect only happens when the entire URL path is empty (not just a prefix match).
  This is commonly used to define a default landing page for your app.
  pathMatch is used to tell Angular how to match the URL path against the route's path value.
  There are two main options for pathMatch:
  1. 'full'
  This means the entire URL path must match the route's path exactly.
  Commonly used for redirects from the root path ('').*/

  
    {path: '', redirectTo: '/home', pathMatch: 'full'},


  
  /*Angulat routing configuration
  path: 'login': This defines a route that matches the URL /login.
  component: LoginComponent: When the user navigates to /login, Angular will display the LoginComponent.*/

  
    { path: 'login', component: LoginComponent },


  
    /*Angular routing configuration
    path: 'register': This defines a route that matches the URL /register.
    component: RegistrationFormComponent: When the user navigates to /register, Angular will display the RegistrationFormComponent.*/
  
    {path: 'register', component: RegistrationFormComponent},
   
    /*Angulat routing configuration
    path: 'home': This defines a route that matches the URL /home.
    component: HomeComponent: When the user navigates to /home, Angular will render the HomeComponent.*/
    {path:'home',component:HomeComponent},


  
  /*This section defines the routing for the Admin module of your application.
  path: 'admin'
  This route matches URLs that start with /admin.

  component: AdminLayoutComponent
  This is the layout component that wraps all child admin pages.
  It likely contains a sidebar, header, and <router-outlet> where child components are rendered.

  canActivate: [AuthGuard]
  This uses an authentication guard to protect the route.
  Only logged-in users can access this route.
  The guard checks if the user is authenticated and has the correct role.

  data: { roles: ['ADMIN'] }
  This is custom metadata passed to the AuthGuard.
  It tells the guard that only users with the 'ADMIN' role should be allowed.
  */
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate:[AuthGuard],
        data: { roles: ['ADMIN'] }, 
        children: [
          
            //URL: /admin/admin-dashboard,Displays the main dashboard for admin users.
            {path: 'admin-dashboard',component: AdminDashboardComponent},
          
            /*URL: /admin/admin-profile,Shows admin's personal profile info.*/
            {path: 'admin-profile',component: AdminProfileComponent},

            /*URL: /admin/customer-management,Admin can view, edit, or manage customer accounts.*/
            {path:'customer-management',component: CustomerManagementComponent},

            /*URL: /admin/claim-management,Admin handles insurance claims submitted by customers*/
            {path:'claim-management',component: ClaimManagementComponent},
            
            /*URL: /admin/user-management,Admin manages all users (agents, customers, etc.).*/
            {path:'user-management',component: UserManagementComponent},

            /* Nested Route: policy-management
            URL base: /admin/policy-management
            This route has its own child routes:
            if no url is found it will redirect to this polic-management path*/
            {
                path: 'policy-management', 
                component: PolicyManagementComponent, 
                children: [
                  { path: '', redirectTo: 'policy-management', pathMatch: 'full' },
                  { path: 'create-policy', component: CreatePolicyComponent },
                  { path: 'update-policy', component: UpdatePolicyComponent },
                  { path: 'view-all-policies', component: ViewAllPoliciesComponent },
                  { path: 'requested-policies', component: RequestedPoliciesComponent },
                ]
              },

            /*URL: /admin/agent-management,Admin can manage agent accounts.*/
            {path:'agent-management',component: AgentManagementComponent},

            /*URL: /admin/agent-management/add-agent, A sub-route for adding a new agent.*/
            {path:'agent-management/add-agent',component: AddAgentComponent},
        ]
    },



  /*This Angular route configuration for the Customer module in detail.
     path: 'customer'
     Matches URLs that start with /customer.

     
      component: CustomerLayoutComponent
      This is the layout wrapper for all customer pages.
      Likely includes a navigation bar, sidebar, and a <router-outlet> where child components are rendered.

      canActivate: [AuthGuard]
      Protects the route using an authentication guard.
      Ensures only logged-in users can access customer routes.

      data: { roles: ['CUSTOMER'] }
      Custom metadata passed to the guard.
      Ensures only users with the 'CUSTOMER' role can access these routes.

      Only authenticated users with the 'CUSTOMER' role can access customer pages.
      All customer pages are organized under a common layout.
      Each feature (claims, policies, profile) has its own dedicated route.
*/
    {
        path: 'customer',
        component: CustomerLayoutComponent,
        canActivate:[AuthGuard],
        data: { roles: ['CUSTOMER'] }, 
        children: [
           
            {path: 'customer-dashboard',component: CustomerDashboardComponent},
            {path:'available-policies',component: AvailablePoliciesComponent},
            {path:'customer-claims',component: CustomerClaimsComponent},
            {path:'registered-policies',component: CustomerRegisteredPoliciesComponent},
            {path:'customer-notification',component:CustomerNotificationsComponent}, // Assuming this is the same as available policies for now
            {path:'policy-requests',component: PolicyRequestsComponent}, // Assuming this is the same as available policies for now
            {path:'customer-profile',component: CustomerProfileComponent},
            {path:'file-claim',component: FileClaimComponent} ,// Assuming this is the same as available policies for now
            {path:'request-newPolicy',component:RequestNewPolicyComponent}

        ]
    },




  /*This route configuration define Agent module in my angular application
  Only authenticated users with the 'AGENT' role can access agent pages.
  All agent-related features are organized under a common layout.
  Each feature (dashboard, policies, claims, profile) has its own dedicated route.*/
    {
        path: 'agent',
        component: AgentLayoutComponent,
        canActivate:[AuthGuard],
        data: { roles: ['AGENT'] },
        children: [

           
            {path: 'agent-dashboard',component: AgentDashboardComponent},
            {path:'agent-profile',component: AgentProfileComponent},
            { path: 'notifications', component:AgentNotificationsComponent },
            { path: 'assigned-policies', component: AssignedPoliciesComponent },
            { path: 'filed-claims', component: FiledClaimsComponent },
            { path: 'available-policies', component:AgentAvailablePoliciesComponent },
            {path:'file-a-claim', component:FileAClaimComponent}
            

        ]
       
    },

  /*Angular processes routes in order. It checks each route from top to bottom. 
  If none of the defined routes match the current URL, 
  it falls back to the wildcard route.*/
    {path: '**', redirectTo: '/home'},
  //Always placed last in the route array

    

];
