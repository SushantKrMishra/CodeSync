import { Message } from "./models/message.js";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", async (chatRoomId) => {
      socket.join(chatRoomId);

      const chatHistory = await Message.find({ chatRoomId }).sort("timestamp");
      socket.emit("chat_history", chatHistory);
    });

    socket.on("send_message", async (data) => {
      const { chatRoomId, senderId, text } = data;

      const message = new Message({ chatRoomId, senderId, text });
      await message.save();

      io.to(chatRoomId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
