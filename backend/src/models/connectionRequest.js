import mongoose from "mongoose";
const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({
  senderId: 1,
  recieverId: 1,
});

connectionRequestSchema.pre("save", function (next) {
  if (this.senderId.equals(this.recieverId)) {
    throw new Error("Not Allowed");
  }
  next();
});

export const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
