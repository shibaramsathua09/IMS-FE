export interface UserWithRoleResponseDto {
    userId: string; // C# Guid maps to 'string' in TypeScript
    username: string;
    role: string;
    isDeleted:string;
  }
  
