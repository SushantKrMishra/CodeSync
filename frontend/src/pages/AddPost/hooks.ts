import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../data/createPost";
import { MutationHookData } from "../../domain/hook_data";
import { deriveMutationState } from "../../domain/hook_impl";
import { Post } from "../Profile/hooks";

export type CreatePostFormState = Pick<Post, "content" | "imageUrl">;

export function useCreatePost(): MutationHookData<CreatePostFormState, void> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["createPost"],
    mutationFn: createPost,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },
  });

  return deriveMutationState(mut);
}
