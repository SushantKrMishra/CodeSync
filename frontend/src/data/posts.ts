import { AxiosError } from "axios";
import { mapAndThrowError } from "../domain/utils";
import { PostFormState } from "../pages/AddPost/hooks";
import { UpdatePost } from "../pages/EditPost/hooks";
import { FeedPost } from "../pages/Home/hooks";
import { Post } from "../pages/Profile/hooks";
import { apiClient } from "./apiClient";

export async function createPost(request: PostFormState): Promise<void> {
  try {
    await apiClient.post("/feed/create", {
      content: request.content,
      imageUrl: request.imageUrl,
    });
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

export async function deletePost(id: string): Promise<void> {
  try {
    await apiClient.delete("/feed/" + id);
  } catch (errr) {
    mapAndThrowError(errr);
  }
}

export async function editPost(
  id: string,
  request: PostFormState
): Promise<void> {
  try {
    await apiClient.patch("/feed/" + id, { ...request });
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getPostById(
  id: string
): Promise<(FeedPost & { isEditingAllowed: boolean }) | "not-found"> {
  try {
    const response = await apiClient.get("/feed/" + id);
    if (response.status === 204) {
      return "not-found";
    }
    return {
      _id: response.data._id,
      postedBy: response.data.postedBy,
      content: response.data.content,
      updatedAt: response.data.updatedAt,
      imageUrl: response.data.imageUrl,
      isEditingAllowed: response.data.isEditingAllowed,
    };
  } catch (err) {
    if (err instanceof AxiosError && err.status === 400) {
      return "not-found";
    }
    mapAndThrowError(err);
  }
}

export async function updatePost(request: UpdatePost): Promise<void> {
  try {
    await apiClient.patch("/feed/" + request.id, { ...request.data });
  } catch (err) {
    mapAndThrowError(err);
  }
}
