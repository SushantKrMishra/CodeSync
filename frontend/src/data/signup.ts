import { mapAndThrowError } from "../domain/utils";
import { SignUpFormState } from "../pages/SignUp/hooks";
import { apiClient } from "./apiClient";

export async function signupApi(request: SignUpFormState): Promise<void> {
  try {
    await apiClient.post(`/open/signup`, request);
  } catch (err) {
    mapAndThrowError(err);
  }
}
