import { mapAndThrowError } from "../domain/utils";
import { ChatRoom, Message, NewMessage, SearchUser } from "../pages/Chat/hooks";
import { apiClient } from "./apiClient";

type ChatRoomData = {
  otherUser: {
    firstName: string;
    lastName: string;
    userName: string;
    _id: string;
  };
  lastMessage: string;
  updatedAt: string;
  _id: string;
};

export async function getChatRooms(): Promise<ChatRoom[]> {
  try {
    const response = await apiClient.get("/chatRoom");
    return response.data.rooms.map((room: ChatRoomData) => {
      return {
        firstName: room.otherUser.firstName,
        lastName: room.otherUser.lastName,
        userName: room.otherUser.userName,
        userId: room.otherUser._id,
        lastMessage: room.lastMessage,
        messageTime: room.updatedAt,
        chatRoomId: room._id,
      };
    });
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function accessUserChatRoom(
  id: string
): Promise<{ id: string; isNew: boolean }> {
  try {
    const response = await apiClient.get("/chatRoom/" + id);
    return { id: response.data?.chatRoomId, isNew: response.status === 201 };
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getSearchSuggestions(
  input: string
): Promise<SearchUser[]> {
  try {
    const response = await apiClient.get("/engage/users?search=" + input);
    return response.data.users;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getMessages(chatRoomId: string): Promise<Message[]> {
  try {
    const response = await apiClient.get("/message/" + chatRoomId);
    return response.data;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function createMessage(request: NewMessage): Promise<void> {
  try {
    await apiClient.post("/message", { ...request });
  } catch (err) {
    mapAndThrowError(err);
  }
}
