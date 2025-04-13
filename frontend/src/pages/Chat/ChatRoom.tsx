import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  ChatRoom,
  Message,
  NewMessage,
  SearchUser,
  useAccessChat,
  useChatRooms,
  useCreateMessage,
  useMessages,
  useSearchSuggestion,
} from "./hooks";

const ChatRoomPage = () => {
  const { data: availableChatRooms, isPending, isError } = useChatRooms();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchedUsers, isError: isSearchError } =
    useSearchSuggestion(searchQuery);
  const {
    invoke: accessChat,
    isError: isAccessError,
    isPending: isAccessing,
  } = useAccessChat();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const {
    data: messages,
    isPending: isMessageLoading,
    isFetching,
    isError: isMessageError,
  } = useMessages(selectedUser);
  const { invoke: createMessage, isError: isCreateError } = useCreateMessage();

  if (
    isError ||
    isSearchError ||
    isAccessError ||
    isMessageError ||
    isCreateError
  ) {
    return <ErrorIndicator />;
  }

  if (availableChatRooms === undefined || isPending) {
    return <LoadingIndicator />;
  }

  return (
    <ChatRoomView
      availableChatRooms={availableChatRooms}
      setSearchQuery={setSearchQuery}
      searchedUsers={searchedUsers!}
      accessChat={accessChat}
      isAccessing={isAccessing}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      messages={messages}
      isMessageLoading={isMessageLoading && isFetching}
      createMessage={createMessage}
    />
  );
};

export default ChatRoomPage;

type Props = {
  availableChatRooms: ChatRoom[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchedUsers: SearchUser[];
  accessChat: (input: string) => Promise<string | undefined>;
  isAccessing: boolean;
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
  messages?: Message[];
  isMessageLoading: boolean;
  createMessage: (input: NewMessage) => Promise<void>;
};

const ChatRoomView: React.FC<Props> = ({
  availableChatRooms,
  searchedUsers,
  setSearchQuery,
  accessChat,
  isAccessing,
  selectedUser,
  setSelectedUser,
  messages,
  isMessageLoading,
  createMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput, setSearchQuery]);

  useEffect(() => {
    const container = document.getElementById("message-container");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const onSearchUserSelect = async (id: string) => {
    if (selectedUser !== id) {
      const selectedId = await accessChat(id);
      setSelectedUser(selectedId ?? "");
    }
  };

  const onSendClick = async () => {
    if (!selectedUser || !newMessage.trim()) {
      return;
    }
    await createMessage({
      chatRoomId: selectedUser,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  return (
    <>
      <div className=" bg-[#d8dada]  mb-2 ">
        <div className="w-full  ">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-2"
            >
              <Typography
                variant="h4"
                fontWeight={700}
                className="text-gray-800 mb-4"
              >
                Messages
              </Typography>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="h-1 mt-1 bg-gradient-to-r from-blue-500 to-purple-600 w-36 mx-auto rounded-full origin-center"
              />
            </motion.div>
          </motion.section>

          <Box
            sx={{
              display: "flex",
              height: "70vh",
              bgcolor: "white",
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: "40%",
                borderRight: "1px solid #e0e0e0",
                p: 2,
                overflowY: "scroll",
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                  fullWidth
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search users to chat"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 20,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
                {searchedUsers && searchedUsers.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      bgcolor: "#fff",
                      boxShadow: 3,
                      borderRadius: 2,
                      mt: 1,
                      maxHeight: 300,
                      overflowY: "auto",
                    }}
                  >
                    {searchedUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        whileHover={{ scale: 1.02 }}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          onSearchUserSelect(user._id);
                          setSearchInput("");
                          setSearchQuery("");
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderBottom: "1px solid #f0f0f0",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <Avatar sx={{ bgcolor: "#212121", mr: 2 }}>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {user.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {`${user.firstName} ${user.lastName}`}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </Box>
              {availableChatRooms.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "69%",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No conversations yet
                  </Typography>
                </Box>
              ) : (
                availableChatRooms.map((chat) => (
                  <motion.div
                    key={chat.chatRoomId}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedUser(chat.chatRoomId)}
                    style={{ cursor: "pointer" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor:
                          selectedUser === chat.chatRoomId
                            ? "#f5f5f5"
                            : "transparent",
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                    >
                      <Avatar sx={{ bgcolor: "#212121", mr: 2 }}>
                        {chat.firstName[0]}
                        {chat.lastName[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600}>
                          {chat.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {chat.lastMessage}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))
              )}
            </Box>

            <Box
              sx={{ width: "60%", display: "flex", flexDirection: "column" }}
            >
              {!selectedUser ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Select a user to start chatting
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}
                    id="message-container"
                  >
                    {messages && messages.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Say hi to start the conversation
                        </Typography>
                      </Box>
                    ) : (
                      messages &&
                      messages.map((message) => (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            placeItems: message.isSelf
                              ? "self-end"
                              : "self-start",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: message.isSelf ? "#212121" : "#f5f5f5",
                              color: message.isSelf ? "white" : "inherit",
                              p: 2,
                              borderRadius: 4,
                              mb: 2,
                              maxWidth: "70%",
                            }}
                          >
                            <Typography>{message.text}</Typography>
                            <Typography
                              variant="caption"
                              color={
                                message.isSelf
                                  ? "rgba(255,255,255,0.7)"
                                  : "text.secondary"
                              }
                            >
                              {new Date(message.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))
                    )}
                  </Box>

                  <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 20,
                          },
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onSendClick();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 20,
                          px: 3,
                          bgcolor: "#212121",
                          "&:hover": { bgcolor: "#424242" },
                        }}
                        onClick={onSendClick}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </div>
      </div>
      <ApplyModal
        show={isAccessing || isMessageLoading}
        message={"Processing your request..."}
      />
    </>
  );
};
