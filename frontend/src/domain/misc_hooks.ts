import { useMutation, useQuery } from "@tanstack/react-query";
import { getSessionStatus, likeHandler } from "../data/misc";
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
