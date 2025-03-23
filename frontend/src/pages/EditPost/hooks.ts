import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById, updatePost } from "../../data/posts";
import { MutationHookData, QueryHookData } from "../../domain/hook_data";
import { deriveMutationState, deriveQueryState } from "../../domain/hook_impl";
import { PostFormState } from "../AddPost/hooks";
import { FeedPost } from "../Home/hooks";

export function usePost(
  id?: string
): QueryHookData<(FeedPost & { isEditingAllowed: boolean }) | "not-found"> {
  const query = useQuery({
    queryKey: ["postInfo"],
    queryFn: () => getPostById(id!.trim()),
    enabled: id !== undefined && id.trim() !== "",
  });
  return deriveQueryState(query);
}

export type UpdatePost = {
  data: PostFormState;
  id: string;
};

export function useUpdatePost(): MutationHookData<UpdatePost, void> {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["updatePost"],
    mutationFn: updatePost,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },
  });
  return deriveMutationState(mutation);
}
