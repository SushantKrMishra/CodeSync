import { User } from "../models/user.js";
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

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      userName: user.userName,
    });
  } catch {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUserProfile = (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
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
  } catch {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
