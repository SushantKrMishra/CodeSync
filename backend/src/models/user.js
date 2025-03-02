import { randomUUID } from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  emailId: { type: String, required: true, unique: true },
  userName: { type: String, default: randomUUID() },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female"] },
});

export const User = mongoose.model("User", userSchema);
