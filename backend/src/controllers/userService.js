import validator from "validator";
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
  } catch (err) {
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
