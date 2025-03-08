import mongoose from "mongoose";
import validator from "validator";

const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      validate: {
        validator: (value) =>
          validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          }),
        message: "Invalid URL format for imageUrl",
      },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
