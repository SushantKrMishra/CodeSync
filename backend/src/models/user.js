import { randomUUID } from "crypto";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, default: null, maxLength: 20 },
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
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
