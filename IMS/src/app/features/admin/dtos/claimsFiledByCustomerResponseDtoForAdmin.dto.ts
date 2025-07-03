export interface ClaimsFiledByCustomerResponseDtoForAdmin {
    claimId: number;
    policyName: string;
    claimAmount: number; 
    status: string;
    agentId?: number; 
  }