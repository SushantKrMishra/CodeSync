import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConnectionSuggestions,
  sendConnectionRequest,
} from "../../data/connections";
import { MutationHookData, QueryHookData } from "../../domain/hook_data";
import { deriveMutationState, deriveQueryState } from "../../domain/hook_impl";
import { UserProfile } from "../Profile/hooks";

export type ConnectionUser = UserProfile & { _id: string };

export const useConnectionSuggestion = (): QueryHookData<ConnectionUser[]> => {
  const query = useQuery({
    queryKey: ["connectionSuggestions"],
    queryFn: getConnectionSuggestions,
  });
  return deriveQueryState(query);
};

export const useSendConnectionRequest = (): MutationHookData<string, void> => {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["sendConnectionRequest"],
    mutationFn: sendConnectionRequest,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["connectionSuggestions"],
      });
      await client.invalidateQueries({
        queryKey: ["userDetail"],
      });
    },
  });
  return deriveMutationState(mutation);
};
