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
        { senderId: req.user._id, recieverId: id },
        { senderId: id, recieverId: req.user._id },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const connectionRequest = new ConnectionRequest({
      senderId: req.user._id,
      recieverId: id,
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
    const deletedRequest = await ConnectionRequest.findOneAndDelete({
      senderId: req.user._id,
      recieverId: id,
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
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: id,
      recieverId: loggedInUser._id,
      status: "pending",
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "No Connection Request",
      });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).json({
      message: `Successfully ${status} connection request`,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
