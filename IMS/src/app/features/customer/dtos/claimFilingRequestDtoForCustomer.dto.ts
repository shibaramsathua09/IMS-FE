export interface ClaimFilingRequestDtoForCustomer {
    //policyId: number;
    customerId: string;
    claimAmount: number; // C# 'decimal' typically maps to 'number' in TypeScript
    // claimType: string; // Assuming claimType is a string, adjust as necessary
    // description?: string; // Optional field for additional information
    policyName:string;
   
  }