import client from "./client";
import { User, UserProfileResponse, CreateUserDto } from "../domain/User";

export const createUser = (dto: CreateUserDto): Promise<User> =>
  client.post<User>("/users", dto).then((r) => r.data);

export const getUserProfile = (): Promise<UserProfileResponse> =>
  client.get<UserProfileResponse>("/users/me").then((r) => r.data);
