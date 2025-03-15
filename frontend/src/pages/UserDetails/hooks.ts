import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../data/profile";
import { QueryHookData } from "../../domain/hook_data";
import { deriveQueryState } from "../../domain/hook_impl";
import { Post, UserProfile } from "../Profile/hooks";

export enum ConnectionStatus {
  None,
  Pending,
  Rejected,
  Accepted,
}

export type UserDetailsInfo = {
  user: UserProfile;
  connectionStatus: ConnectionStatus;
  posts: Post[];
};

export function useUserDetails(
  id?: string
): QueryHookData<UserDetailsInfo | "not-found"> {
  const query = useQuery({
    queryKey: ["userDetail"],
    queryFn: () => getUserDetails(id!.trim()),
    enabled: id !== undefined && id.trim() !== "",
  });
  return deriveQueryState(query);
}
