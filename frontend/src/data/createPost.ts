import { mapAndThrowError } from "../domain/utils";
import { CreatePostFormState } from "../pages/AddPost/hooks";
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
