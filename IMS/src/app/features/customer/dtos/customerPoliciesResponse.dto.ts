export interface CustomerPoliciesResponseDto {
  policyId: number;
  availablePolicyName: string;
  issuedDate: string; // Typically represented as an ISO 8601 string in TypeScript
  expiryDate: string; // Typically represented as an ISO 8601 string in TypeScript
  agentName: string;
  agentContact: string;
  BasePremium: number; // Assuming basePremium is a number, adjust type as necessary
}