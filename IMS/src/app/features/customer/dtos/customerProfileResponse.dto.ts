export interface CustomerProfileResponseDto {
    name: string;
    username: string;
    customerId:string;
    email: string;
    phone: string;
    address: string;
    userId: string; // GUIDs are typically represented as strings in TypeScript
    dateOfBirth: string; // DateTime objects are usually represented as ISO 8601 strings
  }