import { useMutation, useQuery, useQueryClient, useIsFetching } from "@tanstack/react-query";
import {
  accessUserChatRoom,
  createMessage,
  getChatRooms,
  getMessages,
  getSearchSuggestions,
} from "../../data/chat";
import { MutationHookData, QueryHookData } from "../../domain/hook_data";
import { deriveMutationState, deriveQueryState } from "../../domain/hook_impl";
import { UserProfile } from "../Profile/hooks";

export type ChatRoom = {
  firstName: string;
  lastName: string;
  userName: string;
  userId: string;
  lastMessage: string;
  messageTime: string;
  chatRoomId: string;
};

export type SearchUser = { _id: string } & Pick<
  UserProfile,
  "firstName" | "lastName" | "userName"
>;

export function useSearchSuggestion(
  input: string
): QueryHookData<SearchUser[]> {
  const query = useQuery({
    queryKey: ["suggestions", input],
    queryFn: () => getSearchSuggestions(input),
    enabled: input.trim() !== "",
  });
  return deriveQueryState(query);
}

export function useChatRooms(): QueryHookData<ChatRoom[]> {
  const query = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getChatRooms,
  });
  return deriveQueryState(query);
}

export function useAccessChat(): MutationHookData<string, string> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["accessChatRoom"],
    mutationFn: accessUserChatRoom,
    async onSuccess(data) {
      if (data.isNew) {
        await client.invalidateQueries({
          queryKey: ["chatRooms"],
        });
      }
    },
  });
  const base = deriveMutationState(mut);
  return {
    ...base,
    data: base.data?.id,
    invoke: async (input: string) => {
      const result = await base.invoke(input);
      return result?.id;
    },
  };
}

export type Message = {
  _id: string;
  text: string;
  isSelf: boolean;
  timestamp: string;
};

export function useMessages(chatRoomId: string): QueryHookData<Message[]> {
  const globalFetchingCount = useIsFetching();
  const refetchCooldownMs = 2500;
  const interval = globalFetchingCount > 0 ? false : refetchCooldownMs;
  const query = useQuery({
    queryKey: ["messages", chatRoomId],
    queryFn: () => getMessages(chatRoomId),
    enabled: chatRoomId.trim() !== "",
    refetchInterval: interval,
  });
  return deriveQueryState(query);
}

export type NewMessage = {
  chatRoomId: string;
  text: string;
};

export function useCreateMessage(): MutationHookData<NewMessage, void> {
  const client = useQueryClient();
  const mut = useMutation({
    mutationKey: ["newChatMessage"],
    mutationFn: createMessage,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["messages"],
      });
      await client.refetchQueries({
        queryKey: ["chatRooms"],
      });
    },
  });
  return deriveMutationState(mut);
}
