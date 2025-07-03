import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../shared/api-response.interface";
import { environment } from "../../../environment/environment.development";
import { CustomerProfileResponseDto } from "../customer/dtos/customerProfileResponse.dto";
import { AgentProfileResponseDto } from "../agent/dtos/agentProfileResponse.dto";
import { AvailablePolicyResponseDto } from "../customer/dtos/availablePolicyResponse.dto";
import { PagedResult } from "../auth/dtos/pagedResponse.dto";
import { PolicyRequestStatusResponseDto } from "../customer/dtos/policyRequestStatusResponse.dto";
import { ClaimStatusResponseDtoForAdmin } from "./dtos/claimStatusResponseDtoForAdmin.dto";
import { AvailablePolicyRequestDto } from "../customer/dtos/availablePolicyRequest.dto";
import { AssignAgentRequestDto } from "./dtos/assignAgentRequest.dto";
import { UserWithRoleResponseDto } from "../auth/dtos/userWithRoleReponse.dto";
import { CustomerRegisterRequestDto } from "../customer/dtos/customerRegisterRequest.dto";
import { CustomerRegisterResponseDto } from "../customer/dtos/customerRegisterResponse.dto";
import { AgentRegisterRequestDto } from "../agent/dtos/agentRegisterRequest.dto";
import { AgentRegisterResponseDto } from "../agent/dtos/agentRegisterResponse.dto";
import { ClaimsFiledByCustomerResponseDtoForAdmin } from "./dtos/claimsFiledByCustomerResponseDtoForAdmin.dto";

@Injectable({
    providedIn: 'root'
})
export class AdminService{

    loading = false;
    loginResult: any = null;
    error: string | null = null;

    constructor(private http: HttpClient){}

    // /**
    //  * Retrieves all policies assigned to the agent.
    //  * @returns An observable that emits an ApiResponse containing a list of assigned policies for the agent.
    //  * This method retrieves all policies assigned to the agent.
    //  */
     
     getAllCustomer(page:number,size:number): Observable<ApiResponse<PagedResult<CustomerProfileResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<CustomerProfileResponseDto>>>(         
            `${environment.apiBaseUrl}/customers?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all agents.
     * @returns An observable that emits an ApiResponse containing a list of agent profiles.
     * This method retrieves all agents.
     */
    getAllAgents(page:number,size:number): Observable<ApiResponse<PagedResult<AgentProfileResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<AgentProfileResponseDto>>>(         
            `${environment.apiBaseUrl}/Agent/admin/agents?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all available policies.
     * @returns An observable that emits an ApiResponse containing a list of available policies.
     * This method retrieves all available policies.
     */
    getAvailablePolicies(page:number,size:number): Observable<ApiResponse<PagedResult<AvailablePolicyResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<AvailablePolicyResponseDto>>>(         
            `${environment.apiBaseUrl}/policies/available?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all policy requests.
     * @returns An observable that emits an ApiResponse containing a list of policy request statuses.
     * This method retrieves all policy requests.
     */
    getPolicyRequests(page:number,size:number): Observable<ApiResponse<PagedResult<PolicyRequestStatusResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<PolicyRequestStatusResponseDto>>>(         
            `${environment.apiBaseUrl}/policies/requests/admin?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all claims.
     * @returns An observable that emits an ApiResponse containing a list of claim statuses for admin.
     * This method retrieves all claims.
     */
    getAllClaims(page:number,size:number): Observable<ApiResponse<PagedResult<ClaimStatusResponseDtoForAdmin>>> {
        return this.http.get<ApiResponse<PagedResult<ClaimStatusResponseDtoForAdmin>>>(         
            `${environment.apiBaseUrl}/Claims/admin/claims?page=${page}&size=${size}`, {withCredentials: true}
        );

    }
    decodeToken(token: string): any {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
          console.error('Invalid token', error);
          return null;
        }
      }
    /**
     * Adds a new available policy.
     * @param payload The details of the available policy to be added.
     * @returns An observable that emits an ApiResponse indicating whether the addition was successful.
     */
    addNewPolicy(payload: AvailablePolicyRequestDto): Observable<ApiResponse<boolean>> {
            return this.http.post<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/policies/available`, payload, //{withCredentials: true}
            );
        }
    /**
     * Updates an existing available policy.
     * @param payload The updated details of the available policy.
     * @param policyId The ID of the policy to be updated.
     * @return An observable that emits an ApiResponse indicating whether the update was successful.
     * This method updates an existing available policy.
     * */
    updateAvailablePolicy(payload: AvailablePolicyRequestDto, policyId:number): Observable<ApiResponse<boolean>> {
            return this.http.put<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/policies/${policyId}/available`, payload, {withCredentials: true}
            );
        }
    /**
     * Deletes an available policy by its ID.
     * @param id The ID of the available policy to be deleted.
     * @return An observable that emits an ApiResponse indicating whether the deletion was successful.
     * This method deletes an available policy by its ID.
     * */
    deleteAvailablePolicy(id:number): Observable<ApiResponse<boolean>> {
            return this.http.delete<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/policies/${id}/available`, {withCredentials: true}
            );
        }

    /**
     * Assigns an agent to a policy request.
     *  * @param payload The details of the agent to be assigned to the policy request.
     * * @param requestId The ID of the policy request to which the agent will be assigned.
     * * @returns An observable that emits an ApiResponse indicating whether the assignment was successful.
     * This method assigns an agent to a policy request.
     * */
    approvePolicyRequest(payload: AssignAgentRequestDto,requestId:number): Observable<ApiResponse<boolean>> {
            return this.http.put<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/policies/${requestId}/approve`, payload, {withCredentials: true}
            );
        }  

    /**
     * Rejects a policy request by its ID.
     * @param requestId The ID of the policy request to be rejected.
     * * @returns An observable that emits an ApiResponse indicating whether the rejection was successful.
     * * This method rejects a policy request by its ID.
     *  */
    rejectPolicyRequest(requestId:number): Observable<ApiResponse<boolean>> {
            return this.http.post<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/policies/${requestId}/reject`, {}, {withCredentials: true}
            );
        } 
        
    /**
     * Approves a claim by its ID.
     * @param claimId The ID of the claim to be approved.
     * * @returns An observable that emits an ApiResponse indicating whether the approval was successful.
     * * This method approves a claim by its ID.
     * */
    approveClaim(claimId:number): Observable<ApiResponse<boolean>> {
            return this.http.post<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/Claims/admin/${claimId}/approve`,{},  {withCredentials: true}
            );
        }
        
    /**
     * Rejects a claim by its ID.
     * @param claimId The ID of the claim to be rejected.
     * * @returns An observable that emits an ApiResponse indicating whether the rejection was successful.
     * * This method rejects a claim by its ID.
     * */
    rejectClaim(claimId:number): Observable<ApiResponse<boolean>> {
            return this.http.post<ApiResponse<boolean>>(
                `${environment.apiBaseUrl}/Claims/admin/${claimId}/reject`,{},  {withCredentials: true}
            );
        } 

    /**
     * Retrieves all users with their roles.
     * * @returns An observable that emits an ApiResponse containing a list of users with their roles.
     * * This method retrieves all users with their roles.
     * */
    getAllUsers(): Observable<ApiResponse<UserWithRoleResponseDto[]>> {
        return this.http.get<ApiResponse<UserWithRoleResponseDto[]>>(
            `${environment.apiBaseUrl}/Auth/users`, {withCredentials: true}
        );
    }

    /**
     * Adds a new customer.
     * @param payload The details of the customer to be added.
     * @returns An observable that emits an ApiResponse containing the added customer's details.
     * This method adds a new customer.
     */
    addNewCustomer(payload: CustomerRegisterRequestDto): Observable<ApiResponse<CustomerRegisterResponseDto>> {          
        return this.http.post<ApiResponse<CustomerRegisterResponseDto>>(
            `${environment.apiBaseUrl}/Admin/add-customer`, payload, {withCredentials: true}
        );
    }

    /**
     * Adds a new agent.
     * @param payload The details of the agent to be added.
     * @returns An observable that emits an ApiResponse containing the added agent's details.
     * This method adds a new agent.
     */
    addAgent(payload: AgentRegisterRequestDto): Observable<ApiResponse<AgentRegisterResponseDto>> {
        return this.http.post<ApiResponse<AgentRegisterResponseDto>>(
            `${environment.apiBaseUrl}/agent/admin/add`, payload //{withCredentials: true}
        );
    }

    /**
     * Retrieves an available policy by its ID.
     * @param availablePolicyId The ID of the available policy to be retrieved.
     * @returns An observable that emits an ApiResponse containing the available policy details.
     * This method retrieves an available policy by its ID.
     */
    getAvailablePolicyById(availablePolicyId:number): Observable<ApiResponse<AvailablePolicyResponseDto>> {         
        return this.http.get<ApiResponse<AvailablePolicyResponseDto>>(
            `${environment.apiBaseUrl}/policies/available/${availablePolicyId}`, {withCredentials: true}
        );
    }

    /**
     * Retrieves a policy request by its ID.
     * @param policyRequestId The ID of the policy request to be retrieved.
     * @returns An observable that emits an ApiResponse containing the policy request status details.
     * This method retrieves a policy request by its ID.
     */
    getCustomerProfileById(customerId: number): Observable<ApiResponse<CustomerProfileResponseDto>> {
        return this.http.get<ApiResponse<CustomerProfileResponseDto>>(
            `${environment.apiBaseUrl}/Admin/${customerId}/customer-profile`, {withCredentials: true}
        );
    }

    /**
     * Retrieves an agent's profile by its ID.
     * @param agentId The ID of the agent whose profile is to be retrieved.
     * @returns An observable that emits an ApiResponse containing the agent's profile details.
     * This method retrieves an agent's profile by its ID.
     */
    getAgentProfileById(agentId: number): Observable<ApiResponse<AgentProfileResponseDto>> {
        return this.http.get<ApiResponse<AgentProfileResponseDto>>(
            `${environment.apiBaseUrl}/Admin/${agentId}/agent-profile`, {withCredentials: true}
        );
    }

    /**
     * Retrieves all claims filed by a specific customer.
     * @param customerId The ID of the customer whose claims are to be retrieved.
     * @returns An observable that emits an ApiResponse containing a list of claims filed by the customer.
     * This method retrieves all claims filed by a specific customer.
     */
    getAllClaimsById(customerId:number): Observable<ApiResponse<ClaimsFiledByCustomerResponseDtoForAdmin[]>> {
        return this.http.get<ApiResponse<ClaimsFiledByCustomerResponseDtoForAdmin[]>>(
            `${environment.apiBaseUrl}/Claims/admin/${customerId}/claims`, {withCredentials: true}
        );
    }
}