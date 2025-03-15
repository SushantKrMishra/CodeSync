import { AxiosError } from "axios";
import { mapAndThrowError } from "../domain/utils";
import { UserProfile } from "../pages/Profile/hooks";
import { UserDetailsInfo } from "../pages/UserDetails/hooks";
import { apiClient } from "./apiClient";
import { convertStringToConnectionStatus } from "./mappings";

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get("/api/profile");
    return {
      firstName: response.data?.firstName,
      lastName: response.data?.lastName,
      age: response.data?.age,
      gender: response.data?.gender,
      userName: response.data?.userName,
      about: response.data?.about,
    };
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function updateUserProfile(
  request: Partial<UserProfile>
): Promise<string | void> {
  try {
    await apiClient.patch("/api/profile", {
      age: request.age,
      gender: request.gender,
      about: request.about,
      firstName: request.firstName,
      lastName: request.lastName,
    });
    if (request.userName !== undefined) {
      await apiClient.patch("api/profile/username", {
        userName: request.userName,
      });
    }
  } catch (err) {
    if (err instanceof AxiosError && err.status === 406) {
      return "User name already taken";
    }
    mapAndThrowError(err);
  }
}

export async function getUserDetails(
  id: string
): Promise<UserDetailsInfo | "not-found"> {
  try {
    const response = await apiClient.get("api/user/" + id);
    return {
      user: {
        userName: response.data.userName,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        age: response.data.age,
        gender: response.data.gender,
        about: response.data.about,
      },
      connectionStatus: convertStringToConnectionStatus(
        response.data.connectionStatus
      ),
      posts: response.data.posts,
    };
  } catch (err) {
    if (err instanceof AxiosError && err.status === 400) {
      return "not-found";
    }
    mapAndThrowError(err);
  }
}
