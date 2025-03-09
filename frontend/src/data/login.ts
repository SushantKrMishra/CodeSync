import axios from "axios";
import { mapAndThrowError } from "../domain/utils";
import { LoginFormState } from "../pages/Login/hooks";
import { BASE_URL } from "./constants";

export async function loginApi(request: LoginFormState): Promise<void> {
  try {
    await axios.post(`${BASE_URL}/open/login`, {
      emailId: request.emailId,
      password: request.password,
    });
  } catch (err) {
    mapAndThrowError(err);
  }
}
