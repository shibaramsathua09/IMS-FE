export interface PolicyRequestStatusResponseDto {
    requestId: number;
    customerName: string;
    
    availablePolicyName: string;
    status: string;
    requestedOn: string; // C# DateTime typically maps to a string (ISO 8601 format) in TypeScript
  }