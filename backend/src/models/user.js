import { randomUUID } from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3 },
    lastName: { type: String, default: null },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Schema Validation Failed: emailId`);
        }
      },
    },
    userName: {
      type: String,
      default: randomUUID(),
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            `Schema Validation Failed: password, Please use a strong password`
          );
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (!value || value < 16) {
          throw new Error(
            `Expected minimum age to be 16 but recieved ${value}`
          );
        }
      },
    },
    gender: { type: String, enum: ["Male", "Female"] },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  return token;
};

export const User = mongoose.model("User", userSchema);
