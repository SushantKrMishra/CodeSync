import { useQuery } from "@tanstack/react-query";
import { getSessionStatus } from "../data/misc";
import { QueryHookData } from "./hook_data";
import { deriveQueryState } from "./hook_impl";

export function useSessionStatus(): QueryHookData<boolean> {
  const query = useQuery({
    queryKey: ["sessionStatus"],
    queryFn: getSessionStatus,
    staleTime: Infinity,
  });
  return deriveQueryState(query);
}
