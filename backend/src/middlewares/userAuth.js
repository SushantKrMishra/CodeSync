import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

dotenv.config();

/**
 * @returns whether a user is valid
 * Checks jwt token to avail the validation
 */
export const userAuthMiddleware = async (req, res, next) => {
  try {
    const { codesync } = req.cookies;
    if (!codesync) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedMessage = await jwt.verify(
      codesync,
      process.env.JWT_SECRET_KEY
    );
    const { _id } = decodedMessage;
    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    //TODO: Logger Here why it failed
    if (err.name === "TokenExpiredError") {
      return res.status(419).json({
        message: "Session expired, Please login again!",
      });
    }
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
