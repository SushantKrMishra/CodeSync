import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchFeeds } from "../../data/home";

interface FeedUserInfo {
  firstName: string;
  lastName: string;
  userName: string;
  _id: string;
}

export interface FeedComment {
  _id: string;
  userId: FeedUserInfo;
  userComment: string;
  createdAt: string;
  isDeleteAllowed: boolean;
}

export interface FeedPost {
  _id: string;
  postedBy: FeedUserInfo;
  content: string;
  updatedAt: string;
  imageUrl?: string;
  isLiked: boolean;
  likedCount: number;
  commentsCount: number;
  comments: FeedComment[];
}

export function useFeeds() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["feeds"] });
    };
  }, [queryClient]);

  return useInfiniteQuery({
    queryKey: ["feeds"],
    queryFn: async ({ pageParam = 1 }) => await fetchFeeds(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
