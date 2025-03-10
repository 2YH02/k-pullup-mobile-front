import { apiFetch } from "./api-fetch";
import { type UserInfo } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRes {
  token: string;
  user: UserInfo;
}

export const signout = async () => {
  return await apiFetch(`/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const signin = async (body: LoginPayload): Promise<LoginRes> => {
  return await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
};
