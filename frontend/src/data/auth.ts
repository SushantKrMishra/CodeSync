import { AxiosError } from "axios";
import { mapAndThrowError } from "../domain/utils";
import { LoginFormState } from "../pages/Login/hooks";
import { SignUpFormState } from "../pages/SignUp/hooks";
import { apiClient } from "./apiClient";

export async function loginApi(request: LoginFormState): Promise<void> {
  try {
    await apiClient.post(`/open/login`, {
      emailId: request.emailId,
      password: request.password,
    });
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post(`/open/logout`);
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function signupApi(
  request: SignUpFormState
): Promise<void | "not-allowed"> {
  try {
    await apiClient.post(`/open/signup`, request);
  } catch (err) {
    if (err instanceof AxiosError && err.status === 406) {
      return "not-allowed";
    }
    mapAndThrowError(err);
  }
}
