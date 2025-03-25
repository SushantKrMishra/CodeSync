import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commentDeleteHandler,
  commentPostHandler,
  getSessionStatus,
  likeHandler,
} from "../data/misc";
import { MutationHookData, QueryHookData } from "./hook_data";
import { deriveMutationState, deriveQueryState } from "./hook_impl";

export function useSessionStatus(): QueryHookData<boolean> {
  const query = useQuery({
    queryKey: ["sessionStatus"],
    queryFn: getSessionStatus,
    staleTime: Infinity,
  });
  return deriveQueryState(query);
}

export function useLikeHook(): MutationHookData<string, void> {
  const mut = useMutation({
    mutationKey: ["likeHandler"],
    mutationFn: likeHandler,
  });
  return deriveMutationState(mut);
}

export function useCommentPostHook(): MutationHookData<
  { postId: string; comment: string },
  string
> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["commentPostHandler"],
    mutationFn: commentPostHandler,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["postInfo"],
      });
    },
  });
  return deriveMutationState(mut);
}

export function useCommentDeleteHook(): MutationHookData<string, void> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["commentDeleteHandler"],
    mutationFn: commentDeleteHandler,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["postInfo"],
      });
    },
  });
  return deriveMutationState(mut);
}
