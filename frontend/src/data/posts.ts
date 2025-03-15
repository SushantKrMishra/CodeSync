import { mapAndThrowError } from "../domain/utils";
import { CreatePostFormState } from "../pages/AddPost/hooks";
import { Post } from "../pages/Profile/hooks";
import { apiClient } from "./apiClient";

export async function createPost(request: CreatePostFormState): Promise<void> {
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
