export interface CustomerRegisterRequestDto {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
}