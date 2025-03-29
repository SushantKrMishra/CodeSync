import { AxiosError } from "axios";
import { mapAndThrowError } from "../domain/utils";
import { PostFormState } from "../pages/AddPost/hooks";
import { UpdatePost } from "../pages/EditPost/hooks";
import { FeedPost } from "../pages/Home/hooks";
import { apiClient } from "./apiClient";

export async function createPost(request: PostFormState): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("content", request.content);
    if (request.imageFile) {
      formData.append("image", request.imageFile);
    }
    await apiClient.post("/feed/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getUserPosts(): Promise<FeedPost[]> {
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

export async function deleteUserCommentPost(id: string): Promise<void> {
  try {
    await apiClient.delete("/engage/admin/comment/" + id);
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
      isLiked: response.data.isLiked,
      likedCount: response.data.likedCount,
      comments: response.data.comments,
      commentsCount: response.data.commentsCount,
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
    const formData = new FormData();
    if (request.data.content) {
      formData.append("content", request.data.content);
    }
    if (request.data.imageFile) {
      formData.append("image", request.data.imageFile);
    }
    await apiClient.patch("/feed/" + request.id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    mapAndThrowError(err);
  }
}
