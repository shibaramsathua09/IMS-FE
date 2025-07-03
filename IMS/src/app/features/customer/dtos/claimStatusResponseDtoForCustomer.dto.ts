export interface ClaimStatusResponseDtoForCustomer {
    claimId: number;
    policyName: string;
    claimAmount: number; // C# 'decimal' typically maps to 'number' in TypeScript
    status: string;
    filedDate: string; // ISO date string
  }