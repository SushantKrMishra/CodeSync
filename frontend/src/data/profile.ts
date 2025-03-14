import { AxiosError } from "axios";
import { mapAndThrowError } from "../domain/utils";
import { Post, UserProfile } from "../pages/Profile/hooks";
import { apiClient } from "./apiClient";

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

export async function getUserPosts(): Promise<Post[]> {
  try {
    const response = await apiClient.get("/feed/myPosts");
    return response.data.data;
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
