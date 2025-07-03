export interface AgentAssignedPolicyResponseDto {
    availablePolicyId: number;
    customerId: number;
    policyId:number;
    phone: string;
    customerName?: string;
    customerEmail?: string;
    issuedDate: string; 
    expiryDate: string; 
  }