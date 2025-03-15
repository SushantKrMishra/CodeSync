import { mapAndThrowError } from "../domain/utils";
import { FeedPost } from "../pages/Home/hooks";
import { apiClient } from "./apiClient";

export async function fetchFeeds(pageParam: number = 1): Promise<FeedPost[]> {
  try {
    const response = await apiClient.get(`/feed?page=${pageParam}&limit=10`);
    return response.data.posts;
  } catch (err) {
    mapAndThrowError(err);
  }
}
