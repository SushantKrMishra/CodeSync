import mongoose from "mongoose";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
    const requestedUser = await User.findById(id);
    if (!requestedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { senderId: req.user._id, recieverId: requestedUser._id },
        { senderId: requestedUser._id, recieverId: req.user._id },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const connectionRequest = new ConnectionRequest({
      senderId: req.user._id,
      recieverId: requestedUser._id,
      status: "pending",
    });
    await connectionRequest.save();
    res.status(200).json({
      message: `Connection request send successfully to ${requestedUser.firstName} ${requestedUser.lastName}`,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const withdrawConnectionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
    const requestedUser = await User.findById(id);
    if (!requestedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const deletedRequest = await ConnectionRequest.findOneAndDelete({
      senderId: req.user._id,
      recieverId: requestedUser._id,
      status: "pending",
    });

    if (!deletedRequest) {
      return res
        .status(400)
        .json({ message: "No pending request found to withdraw" });
    }

    res
      .status(200)
      .json({ message: "Connection request withdrawn successfully" });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const handleConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id, status } = req.params;

    if (!status || !id) {
      return res.status(400).json({ message: "Bad request" });
    }

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Bad request" });
    }

    const requestedUser = await User.findById(id);
    if (!requestedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      senderId: id,
      recieverId: loggedInUser._id,
      status: "pending",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "No Connection Request" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res
      .status(200)
      .json({ message: `Successfully ${status} connection request` });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *
 * @param {*} res return users suggestions to follow
 */
export const connectionSuggestion = async (req, res) => {
  try {
    const interactedUser = await ConnectionRequest.find({
      $or: [{ senderId: req.user._id }, { recieverId: req.user._id }],
    });
    const excludedUsers = new Set();
    interactedUser.forEach((user) => {
      excludedUsers.add(user.senderId.toString());
      excludedUsers.add(user.recieverId.toString());
    });
    excludedUsers.add(req.user._id.toString());
    const excludedObjectIds = Array.from(excludedUsers).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const user = await User.aggregate([
      { $match: { _id: { $nin: excludedObjectIds } } },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          userName: 1,
          firstName: 1,
          lastName: 1,
          about: 1,
        },
      },
    ]);

    res.status(200).json({ data: user });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
