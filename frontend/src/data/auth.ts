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
): Promise<"success" | "not-allowed" | void> {
  try {
    const response = await apiClient.post(`/open/signup`, request);
    if (response.status === 201) {
      return "success";
    }
    return;
  } catch (err) {
    if (err instanceof AxiosError && err.status === 406) {
      return "not-allowed";
    }
    mapAndThrowError(err);
  }
}
