import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../data/profile";
import { QueryHookData } from "../../domain/hook_data";
import { deriveQueryState } from "../../domain/hook_impl";
import { FeedPost } from "../Home/hooks";
import { UserProfile } from "../Profile/hooks";

export enum ConnectionStatus {
  None,
  Pending,
  Rejected,
  Accepted,
  Recieved,
}

export type UserDetailsInfo = {
  user: UserProfile;
  connectionStatus: ConnectionStatus;
  posts: FeedPost[];
};

export function useUserDetails(
  id?: string
): QueryHookData<UserDetailsInfo | "not-found"> {
  const query = useQuery({
    queryKey: ["userDetail", id],
    queryFn: () => getUserDetails(id!.trim()),
    enabled: id !== undefined && id.trim() !== "",
  });
  return deriveQueryState(query);
}
