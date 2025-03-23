import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getUserPosts } from "../../data/posts";
import { getUserProfile, updateUserProfile } from "../../data/profile";
import { MutationHookData, QueryHookData } from "../../domain/hook_data";
import { deriveMutationState, deriveQueryState } from "../../domain/hook_impl";

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  userName: string;
  about?: string;
}

export interface Post {
  _id: string;
  content: string;
  updatedAt: string;
  imageUrl?: string;
}

export function useUserProfile(): QueryHookData<UserProfile> {
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
  return deriveQueryState(query);
}

export function useUserPosts(): QueryHookData<Post[]> {
  const query = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPosts,
  });
  return deriveQueryState(query);
}

export function useUpdateUserProfileInfo(): MutationHookData<
  Partial<UserProfile>,
  void | string
> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["updateUserProfile"],
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["userProfile"],
      });
    },
  });
  return deriveMutationState(mut);
}

export function useDeletePost(): MutationHookData<string, void> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: deletePost,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
  return deriveMutationState(mut);
}
