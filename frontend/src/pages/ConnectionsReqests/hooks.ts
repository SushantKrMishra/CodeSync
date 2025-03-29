import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecievedConnections,
  getSendConnections,
  handleConnection,
  withdrawConnection,
} from "../../data/connections";
import { MutationHookData, QueryHookData } from "../../domain/hook_data";
import { deriveMutationState, deriveQueryState } from "../../domain/hook_impl";
import { ConnectionUser } from "../ConnectionSuggestion/hooks";

export function useRecievedConnectionRequest(): QueryHookData<
  ConnectionUser[]
> {
  const query = useQuery({
    queryKey: ["recivedConnections"],
    queryFn: getRecievedConnections,
  });
  return deriveQueryState(query);
}

export function useSendConnectionRequest(): QueryHookData<ConnectionUser[]> {
  const query = useQuery({
    queryKey: ["sendConnections"],
    queryFn: getSendConnections,
  });
  return deriveQueryState(query);
}

export function useWithdrawConnectionRequest(): MutationHookData<string, void> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["withdrawConnection"],
    mutationFn: withdrawConnection,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["sendConnections"],
      });
      await client.invalidateQueries({
        queryKey: ["userDetail"],
      });
    },
  });
  return deriveMutationState(mut);
}

export type HandleConnection = {
  id: string;
  status: "accepted" | "rejected";
};
export function useHandleConnectionRequest(): MutationHookData<
  HandleConnection,
  void
> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["handleConnection"],
    mutationFn: handleConnection,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["recivedConnections"],
      });
      await client.invalidateQueries({
        queryKey: ["userDetail"],
      });
    },
  });
  return deriveMutationState(mut);
}
