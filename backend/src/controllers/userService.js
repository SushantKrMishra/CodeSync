import validator from "validator";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { Post } from "../models/posts.js";
import { User } from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/passwordHasher.js";
import { validateProfileUpdateData } from "../utils/validation.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      users: users,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

import mongoose from "mongoose";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(id).select(
      "firstName lastName age gender userName about"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf = userId.equals(id);

    // Get total number of posts
    const postsCount = await Post.countDocuments({ postedBy: id });

    const posts = await Post.aggregate([
      { $match: { postedBy: new mongoose.Types.ObjectId(id) } },

      // Lookup likes
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
            {
              $group: {
                _id: null,
                likedCount: { $sum: 1 },
                users: { $push: "$userId" },
              },
            },
          ],
          as: "likesData",
        },
      },

      // Lookup comments and populate users
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
            { $sort: { createdAt: -1 } },

            // Populate user details for each comment
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" },

            {
              $project: {
                _id: 1,
                userId: {
                  _id: "$userDetails._id",
                  firstName: "$userDetails.firstName",
                  lastName: "$userDetails.lastName",
                  userName: "$userDetails.userName",
                },
                userComment: 1,
                createdAt: 1,
                isDeleteAllowed: {
                  $eq: ["$userId", new mongoose.Types.ObjectId(userId)],
                },
              },
            },
          ],
          as: "comments",
        },
      },

      {
        $project: {
          _id: 1,
          imageUrl: 1,
          content: 1,
          updatedAt: 1,
          likedCount: {
            $ifNull: [{ $arrayElemAt: ["$likesData.likedCount", 0] }, 0],
          },
          isLiked: {
            $in: [
              userId,
              { $ifNull: [{ $arrayElemAt: ["$likesData.users", 0] }, []] },
            ],
          },
          commentsCount: { $size: "$comments" },
          comments: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    // Get connection status between logged-in user and requested user
    const connection = await ConnectionRequest.findOne(
      {
        $or: [
          { senderId: userId, recieverId: user._id },
          { senderId: user._id, recieverId: userId },
        ],
      },
      { senderId: 1, status: 1 }
    ).lean();

    const connectionStatus = connection
      ? connection.status === "pending"
        ? connection.senderId.toString() === userId.toString()
          ? "pending"
          : "received"
        : connection.status
      : "none";

    // Get follower count
    const followerCount = await ConnectionRequest.countDocuments({
      $or: [
        { recieverId: user._id, status: "accepted" },
        { senderId: user._id, status: "accepted" },
      ],
    });

    res.status(200).json({
      isSelf,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      userName: user.userName,
      about: user.about,
      posts,
      postsCount,
      connectionStatus,
      followerCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserProfile = (req, res) => {
  const user = req.user;
  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    userName: user.userName,
    about: user.about,
  });
};

export const updateUserProfile = async (req, res) => {
  try {
    if (!validateProfileUpdateData(req.body)) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const doesUserNameExists = await User.find({
      userName: userName,
    });

    if (doesUserNameExists.length > 0) {
      return res.status(406).json({
        message: "Username already taken!",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { userName: userName },
      { runValidators: true, returnDocument: "after" }
    );

    if (!updatedUser) {
      throw new Error("Unable to update user details");
    }

    res.status(200).json({
      message: "Username updated successfully",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
        userName: updatedUser.userName,
        age: updatedUser.age,
      },
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateUserPasscode = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
    const isPasswordValid = await comparePassword(
      currentPassword,
      req.user.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(406).json({
        message: "Please use a strong password",
      });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(newPassword),
    });
    if (!user) {
      throw new Error("Unable to update the passcode");
    }
    res
      .cookie("codesync", null, { expires: new Date(Date.now()) })
      .status(200)
      .json({
        message: "Password updated successfully",
      });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getReceivedConnectionRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      recieverId: loggedInUser._id,
      status: "pending",
    }).populate("senderId", "firstName lastName userName about _id");

    const data = connectionRequests.map((e) => e.senderId);

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSendConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      senderId: loggedInUser._id,
      status: "pending",
    }).populate(
      ["recieverId"],
      ["firstName", "lastName", "userName", "about", "_id"]
    );
    const data = connectionRequests.map((e) => e.recieverId);
    res.status(200).json({
      data,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getConnections = async (req, res) => {
  try {
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          senderId: req.user._id,
          status: "accepted",
        },
        {
          recieverId: req.user._id,
          status: "accepted",
        },
      ],
    }).populate(
      ["senderId", "recieverId"],
      ["firstName", "lastName", "userName"]
    );

    const data = connectionRequest.map((e) => {
      if (e.senderId._id.toString() === req.user._id.toString()) {
        return e.recieverId;
      }
      return e.senderId;
    });
    res.status(200).json({ data });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
