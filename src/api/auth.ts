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

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface SignupRes extends Omit<UserInfo, "username"> {
  username?: string;
}

export const signout = async () => {
  return await apiFetch(`/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const signin = async (body: LoginPayload): Promise<LoginRes> => {
  return await apiFetch("/auth/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const sendPasswordResetEmail = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);

  return await apiFetch(
    `/auth/request-password-reset`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const sendSignupCode = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);

  const response = await fetch(`/api/v1/auth/verify-email/send`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  const text = await response.text();

  return text;
};

export const verifyCode = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("token", code);

  const response = await apiFetch(
    `/auth/verify-email/confirm`,
    {
      method: "POST",
      body: formData,
    },
    { returnType: "text" }
  );

  return response;
};

export const signup = async (body: SignupPayload): Promise<SignupRes> => {
  return await apiFetch(`/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
