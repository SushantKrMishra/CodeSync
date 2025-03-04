import { User } from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/passwordHasher.js";
import { validateLoginData, validateSignupData } from "../utils/validation.js";

export const createUser = async (req, res) => {
  try {
    const payload = req.body;
    if (!validateSignupData(payload)) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const user = new User({
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailId: payload.emailId,
      password: await hashPassword(payload.password),
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
