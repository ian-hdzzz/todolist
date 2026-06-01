export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  providerUid: string;
  role: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}
