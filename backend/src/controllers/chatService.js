import mongoose from "mongoose";
import { ChatRoom } from "../models/chatRoom.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

export const accessChatRoom = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const doesUserExists = await User.findById(userId);
    if (!doesUserExists) {
      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const chatRoom = await ChatRoom.findOne({
      members: { $all: [userId, req.user._id] },
    });
    res.status(200);

    if (!chatRoom) {
      const newChatRoom = new ChatRoom({ members: [userId, req.user._id] });
      await newChatRoom.save();
      return res.status(201).json({ chatRoomId: newChatRoom._id });
    }

    res.json({ chatRoomId: chatRoom._id });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getChatRooms = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatRooms = await ChatRoom.aggregate([
      {
        $match: {
          members: userId,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatRoomId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatRoomId", "$$chatRoomId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { text: 1 } },
          ],
          as: "lastMessage",
        },
      },
      {
        $addFields: {
          lastMessage: {
            $ifNull: [
              { $arrayElemAt: ["$lastMessage.text", 0] },
              "No messages yet",
            ],
          },
        },
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$members",
                        as: "member",
                        cond: { $ne: ["$$member", userId] },
                      },
                    },
                  },
                  0,
                ],
              },
              {
                $first: {
                  $filter: {
                    input: "$members",
                    as: "member",
                    cond: { $ne: ["$$member", userId] },
                  },
                },
              },
              userId,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          updatedAt: 1,
          otherUser: {
            _id: "$otherUser._id",
            firstName: "$otherUser.firstName",
            lastName: "$otherUser.lastName",
            userName: "$otherUser.userName",
          },
        },
      },
    ]);

    res.status(200).json({ rooms: chatRooms });
  } catch (error) {
    console.error("Error in aggregated getChatRooms:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { chatRoomId, text } = req.body;

    const message = new Message({ chatRoomId, senderId: req.user._id, text });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatRoomId } = req.params;
    const userId = req.user._id;

    const messages = await Message.aggregate([
      { $match: { chatRoomId: new mongoose.Types.ObjectId(chatRoomId) } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          _id: 1,
          text: 1,
          timestamp: 1,
          isSelf: { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
        },
      },
    ]);

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
