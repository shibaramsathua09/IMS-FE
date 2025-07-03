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
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },

    
    {path: 'register', component: RegistrationFormComponent},
   
    
    {path:'home',component:HomeComponent},
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate:[AuthGuard],
        data: { roles: ['ADMIN'] }, 
        children: [
            
            {path: 'admin-dashboard',component: AdminDashboardComponent},
            {path: 'admin-profile',component: AdminProfileComponent},
            {path:'customer-management',component: CustomerManagementComponent},
            {path:'claim-management',component: ClaimManagementComponent},
            {path:'user-management',component: UserManagementComponent},
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
         
            {path:'agent-management',component: AgentManagementComponent},
            {path:'agent-management/add-agent',component: AddAgentComponent},


        ]
    },
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

    {path: '**', redirectTo: '/home'},

    

];