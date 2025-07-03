import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiResponse } from "../../shared/api-response.interface";
import { environment } from "../../../environment/environment.development";
import { AgentAssignedPolicyResponseDto } from "./dtos/agentAssignedPolicy.dto";
import { AgentProfileResponseDto } from "./dtos/agentProfileResponse.dto";
import { AgentProfileUpdateRequestDto } from "./dtos/agentProfileUpdateResponse.dto";
import { ClaimFilingRequestDtoForAgent } from "./dtos/claimFilingRequestDtoForAgent.dto";
import { ClaimStatusResponseDtoForAgent } from "./dtos/claimStatusResponseDtoForAgent.dto";
import { AgentRegisterRequestDto } from "./dtos/agentRegisterRequest.dto";
import { AgentRegisterResponseDto } from "./dtos/agentRegisterResponse.dto";
import { NotificationResponseDto } from "../auth/dtos/notificationResponseDto.dto";
import { AvailablePolicyResponseDto } from "../customer/dtos/availablePolicyResponse.dto";
import { PagedResult } from "../../shared/pagedResult.dto";

@Injectable({
    providedIn: 'root'
})
export class AgentService{

    loading = false;
    loginResult: any = null;
    error: string | null = null;

    private agentProfileSubject = new BehaviorSubject<AgentProfileResponseDto | null>(null);
    agentProfile$ = this.agentProfileSubject.asObservable();

    constructor(private http: HttpClient){}


    /**
     * Retrieves the agent's profile information.
     * @returns An observable that emits an ApiResponse containing the agent's profile data.
     */
 
    /**
     * Gets the agnet profile from the API and updates the BehaviorSubject.
     */
    fetchAndStoreAgentProfile(): Observable<ApiResponse<AgentProfileResponseDto>> {
        return new Observable<ApiResponse<AgentProfileResponseDto>>(observer => {
            this.http.get<ApiResponse<AgentProfileResponseDto>>(
                `${environment.apiBaseUrl}/Agent/profile`, {withCredentials: true}
            ).subscribe({
                next: (response) => {
                    if (response.isSuccess && response.data) {
                        this.agentProfileSubject.next(response.data);
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
     * Returns the current value of the agent profile (may be null if not loaded yet).
     */
      getCurrentAgentProfile(): AgentProfileResponseDto | null {
        return this.agentProfileSubject.value;
    }


     /**
     * Returns the agent profile as an observable (for async pipe or subscription).
     * If not loaded, call fetchAndStoreagentProfile() first.
     */
     getAgentProfile$() {
        return this.agentProfile$;
    }


    /**
     *  * Retrieves all policies assigned to the agent.
     * @returns An observable that emits an ApiResponse containing a list of assigned policies for the agent.
     * This method retrieves all policies assigned to the agent.
     * 
     */

    getAllAssignedPolicies(): Observable<ApiResponse<AgentAssignedPolicyResponseDto>> {
        return this.http.get<ApiResponse<AgentAssignedPolicyResponseDto>>(
            `${environment.apiBaseUrl}/policies/assigned`, {withCredentials: true}
        );
    }

  
    /**
     * Updates the agent's profile information.
     * @param payload The updated profile data for the agent.
     * @returns An observable that emits an ApiResponse indicating whether the update was successful.
     */
    updateAgentProfileResponse():Observable<ApiResponse<boolean>>{
        return this.http.put<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/Agent/profile`, {withCredentials: true}
        );
    }

    /**
     * Submits a claim filing request for the agent.
     * @param payload The claim filing request data.
     * @returns An observable that emits an ApiResponse indicating whether the claim filing was successful.
     */
    //claim filing request for agent
    fileClaim(payload: ClaimFilingRequestDtoForAgent): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/Claims/agent/file`, payload, {withCredentials: true}
        );
    }

    /**
     * Retrieves the status of claims for the agent.
     * @returns An observable that emits an ApiResponse containing a boolean indicating the claim status.
     */
    getFiledClaims(): Observable<ApiResponse<ClaimStatusResponseDtoForAgent>> {
        return this.http.get<ApiResponse<ClaimStatusResponseDtoForAgent>>(
            `${environment.apiBaseUrl}/Claims/agent/filed-claims`, {withCredentials: true}
        );
    }

    /**
     * Registers a new agent.
     * @param payload The registration data for the new agent.
     * @returns An observable that emits an ApiResponse containing the registration result.
     */
    getNotifications(): Observable<ApiResponse<NotificationResponseDto[]>> {         
        return this.http.get<ApiResponse<NotificationResponseDto[]>>(
            `${environment.apiBaseUrl}/notifications/user`, {withCredentials: true}
        );
    }

    /**
     * 
     * @param payload The registration data for the new agent.
     * This method registers a new agent with the provided payload.
     * @returns 
     */

    registerAgent(payload: AgentRegisterRequestDto): Observable<ApiResponse<AgentRegisterResponseDto>> {
        return this.http.post<ApiResponse<AgentRegisterResponseDto>>(
            `${environment.apiBaseUrl}/Agent/register`, payload, {withCredentials: true}
        );
    }

    /**
     * Retrieves all available policies for the agent.
     * @param page The page number for pagination.
     * @param size The number of items per page.
     * @returns An observable that emits an ApiResponse containing a paginated list of available policies.
     */
    getAvailablePolicies(page:number,size:number): Observable<ApiResponse<PagedResult<AvailablePolicyResponseDto>>> {
        return this.http.get<ApiResponse<PagedResult<AvailablePolicyResponseDto>>>(        
            `${environment.apiBaseUrl}/policies/available?page=${page}&size=${size}`, {withCredentials: true}
        );
    }

    /**
     * Creates a new agent profile.
     * @param payload The data for the new agent profile.
     * @returns An observable that emits an ApiResponse containing the created agent profile data.
     */
    updateAgentProfile(payload: AgentProfileUpdateRequestDto): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(
            `${environment.apiBaseUrl}/Agent/profile`,payload, {withCredentials: true}
        );
    }


    

}