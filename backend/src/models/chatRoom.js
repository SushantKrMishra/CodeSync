import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [arrayLimit, "A chat room must have exactly two members"],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length === 2;
}

export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
