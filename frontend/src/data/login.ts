import { mapAndThrowError } from "../domain/utils";
import { LoginFormState } from "../pages/Login/hooks";
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
