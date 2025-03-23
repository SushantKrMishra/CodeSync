import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../../data/connections";
import { QueryHookData } from "../../domain/hook_data";
import { deriveQueryState } from "../../domain/hook_impl";
import { ConnectionUser } from "../ConnectionSuggestion/hooks";

export function useConnections(): QueryHookData<ConnectionUser[]> {
  const query = useQuery({
    queryKey: ["connection"],
    queryFn: getConnections,
  });
  return deriveQueryState(query);
}
