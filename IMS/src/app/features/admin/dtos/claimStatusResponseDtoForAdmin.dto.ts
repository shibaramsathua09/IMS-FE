export interface ClaimStatusResponseDtoForAdmin {
    claimId: number;
    policyName: string;
    claimAmount: number; 
    status: string;
    customerName: string;
    agentName: string; 
  }