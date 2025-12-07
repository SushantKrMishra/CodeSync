import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../data/posts";
import { MutationHookData } from "../../domain/hook_data";
import { deriveMutationState } from "../../domain/hook_impl";
import { FeedPost } from "../Home/hooks";

export type PostFormState = Pick<FeedPost, "content"> & { imageFile?: File };

export function useCreatePost(): MutationHookData<PostFormState, void> {
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
