import { randomUUID } from "crypto";
import multer from "multer";
import { User } from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/passwordHasher.js";
import { validateLoginData, validateSignupData } from "../utils/validation.js";
const upload = multer({ dest: "../images/profile" });

export const sessionAuthValid = async (req, res) => {
  //We are sure that user passed middleware check
  res.status(200).json({
    message: "User Validated",
  });
};

export const createUser = async (req, res) => {
  try {
    const payload = req.body;
    if (!validateSignupData(payload)) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const isUserAlreadyPresent = await User.findOne({
      emailId: payload.emailId,
    });

    if (isUserAlreadyPresent) {
      return res.status(406).json({
        message: "Not allowed",
      });
    }

    const user = new User({
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailId: payload.emailId,
      password: await hashPassword(payload.password),
      userName: randomUUID(),
    });
    await user.save();
    res.status(201).json({
      message: "User Data added Successfully",
    });
  } catch (err) {
    //TODO: Logger here
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({
      message: "Something went wrong",
      err,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const payload = req.body;
    if (!validateLoginData(payload)) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const user = await User.findOne({ emailId: payload.emailId });
    if (!user) {
      //TODO: Logger here for user not present
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await comparePassword(
      payload?.password,
      user.password
    );
    if (!isPasswordValid) {
      //TODO: Logger here for password incorrect
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    //Token
    const token = await user.getJWT();
    res.cookie("codesync", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() + 3600000 * 48),
    });
    res.status(200).json({
      message: "Login Successful",
    });
  } catch (err) {
    //TODO: Logger here
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const logoutUser = async (req, res) => {
  res
    .cookie("codesync", null, { expires: new Date(Date.now()) })
    .status(200)
    .json({
      message: "Logged out successfully",
    });
};
