import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiResponse } from "../../shared/api-response.interface";

import { CustomerProfileUpdateRequestDto } from "./dtos/customerProfileUpdatedRequest.dto";
import { CustomerPoliciesResponseDto } from "./dtos/customerPoliciesResponse.dto";
import { PolicyRequestStatusResponseDto } from "./dtos/policyRequestStatusResponse.dto";
import { ClaimFilingRequestDtoForCustomer } from "./dtos/claimFilingRequestDtoForCustomer.dto";
import { PolicyRequestDto } from "./dtos/policyrequest.dto";
import { ClaimStatusResponseDtoForCustomer } from "./dtos/claimStatusResponseDtoForCustomer.dto";
import { NotificationResponseDto } from "../auth/dtos/notificationResponseDto.dto";
import { PagedResult } from "../../shared/pagedResult.dto";
import { AvailablePolicyResponseDto } from "./dtos/availablePolicyResponse.dto";
import { CustomerProfileResponseDto } from "./dtos/customerProfileResponse.dto";
import { environment } from "../../../environment/environment.development";

@Injectable({
    providedIn: 'root'
})
export class CustomerService{

    loading = false;
    loginResult: any = null;
    error: string | null = null;

    private customerProfileSubject = new BehaviorSubject<CustomerProfileResponseDto | null>(null);
    customerProfile$ = this.customerProfileSubject.asObservable();
 
    constructor(private http: HttpClient){}
 
    /**
     * Retrieves the customer's profile information.
     * @returns An observable that emits an ApiResponse containing the customer's profile data.
     */
 
    /**
     * Gets the customer profile from the API and updates the BehaviorSubject.
     */
    fetchAndStoreCustomerProfile(): Observable<ApiResponse<CustomerProfileResponseDto>> {
        return new Observable<ApiResponse<CustomerProfileResponseDto>>(observer => {
            this.http.get<ApiResponse<CustomerProfileResponseDto>>(
                `${environment.apiBaseUrl}/Customers/profile`, {withCredentials: true}
            ).subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        this.customerProfileSubject.next(response.data);
                    }
                    observer.next(response);
                    observer.complete();
                },
                error: (err) => {
                    observer.error(err);
                }
            });
        });
    }
 
    /**
     * Returns the current value of the customer profile (may be null if not loaded yet).
     */
    getCurrentCustomerProfile(): CustomerProfileResponseDto | null {
        return this.customerProfileSubject.value;
    }
 
    /**
     * Returns the customer profile as an observable (for async pipe or subscription).
     * If not loaded, call fetchAndStoreCustomerProfile() first.
     */
    getCustomerProfile$() {
        return this.customerProfile$;
    }
    /**
     * Updates the customer's profile information.
     * @param payload The updated profile data for the customer.
     * @returns An observable that emits an ApiResponse indicating whether the update was successful.
     */
    updateCustomerProfile(payload: CustomerProfileUpdateRequestDto): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/customers/profile`, payload, {withCredentials: true}
        );
    }

    /**
     * Retrieves all policies associated with the customer.
     * @returns An observable that emits an ApiResponse containing a list of customer policies.
     */
    getCustomerPolicies(): Observable<ApiResponse<CustomerPoliciesResponseDto[]>> {
        return this.http.get<ApiResponse<CustomerPoliciesResponseDto[]>>(
            `${environment.apiBaseUrl}/policies/customer-registered`, {withCredentials: true}
        );
    }

    /**
     * Retrieves the status of policy requests made by the customer.
     * @returns An observable that emits an ApiResponse containing a list of policy request statuses.
     */
    getCustomerPolicyRequests(): Observable<ApiResponse<PolicyRequestStatusResponseDto[]>> {   
        return this.http.get<ApiResponse<PolicyRequestStatusResponseDto[]>>(
            `${environment.apiBaseUrl}/policies/customer-requests`, {withCredentials: true}
        );
    }

    /**
     * Submits a claim filing request for the customer.
     * @param payload The claim filing request data.
     * @returns An observable that emits an ApiResponse indicating whether the claim filing was successful.
     */
    fileClaim(payload: ClaimFilingRequestDtoForCustomer): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/Claims/customer/file`, payload, {withCredentials: true}
        );
    }

    /**
     * Requests a policy for the customer.
     * @param payload The policy request data.
     * @returns An observable that emits an ApiResponse indicating whether the policy request was successful.
     */
    requestPolicy(payload: PolicyRequestDto): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/policies/request`, payload, {withCredentials: true}
        );
    }

    /**
     * Retrieves the status of claims filed by the customer.
     * @returns An observable that emits an ApiResponse containing a list of claim statuses for the customer.
     */
    getClaims(): Observable<ApiResponse<ClaimStatusResponseDtoForCustomer[]>> {
        return this.http.get<ApiResponse<ClaimStatusResponseDtoForCustomer[]>>(
            `${environment.apiBaseUrl}/Claims/customer/my-claims`, {withCredentials: true}
        );
    }

    /**
     * Retrieves notifications for the customer.
     * @returns An observable that emits an ApiResponse containing a list of notifications for the customer.
     */
    getNotifications(): Observable<ApiResponse<NotificationResponseDto[]>> {
        return this.http.get<ApiResponse<NotificationResponseDto[]>>(
            `${environment.apiBaseUrl}/notifications/user`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all available policies for the customer.
     * @param page The page number for pagination.
     * @param size The number of items per page.
     * @returns An observable that emits an ApiResponse containing a paged result of available policies.
     */
    getAllAvailablePolicies(page:number,size:number): Observable<ApiResponse<PagedResult<AvailablePolicyResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<AvailablePolicyResponseDto>>>(
            `${environment.apiBaseUrl}/policies/available?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves a specific available policy by its ID.
     * @param availablePolicyId The ID of the available policy to retrieve.
     * @returns An observable that emits an ApiResponse containing the available policy data.
     */
    getAvailablePolicyById(availablePolicyId:number): Observable<ApiResponse<AvailablePolicyResponseDto[]>> {
        return this.http.get<ApiResponse<AvailablePolicyResponseDto[]>>(
            `${environment.apiBaseUrl}/policies/available/${availablePolicyId}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves the status of a specific policy request by its ID.
     * @param policyRequestId The ID of the policy request to retrieve.
     * @returns An observable that emits an ApiResponse containing the policy request status data.
     */
    getPolicyRequestById(policyRequestId: number): Observable<ApiResponse<PolicyRequestStatusResponseDto>> {    
        return this.http.get<ApiResponse<PolicyRequestStatusResponseDto>>(
            `${environment.apiBaseUrl}/policies/request/${policyRequestId}`, {withCredentials: true}
        );
    }

    /**
     * Deletes the customer's account.
     * @returns An observable that emits an ApiResponse indicating whether the account deletion was successful.
     */
    deleteCustomer(): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/customers/delete-account`, {withCredentials: true}
        );
    }
}