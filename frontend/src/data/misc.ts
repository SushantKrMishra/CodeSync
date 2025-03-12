import { apiClient } from "./apiClient";

export async function getSessionStatus(): Promise<boolean> {
  try {
    const response = await apiClient.get(`/open/sessionAuthValid`);
    return response.status === 200;
  } catch {
    //It means session is Invalid
    //Swallowing the error as it is not required here
    return false;
  }
}
