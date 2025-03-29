import mongoose from "mongoose";
import { Comment } from "../models/comments.js";
import { Post } from "../models/posts.js";

export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const { userComment } = req.body;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (!userComment) {
      return res.status(400).json({ message: "Bad request" });
    }

    const comment = new Comment({
      postId: postId,
      userId: userId,
      userComment: userComment,
    });

    const data = await comment.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", id: data._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const comment = await Comment.findOneAndDelete({ _id: id, userId });

    if (!comment) {
      return res.status(400).json({ message: "Bad request" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const adminDeleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    const result = await Comment.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      { $project: { _id: 1, userComment: 1, postOwner: "$post.postedBy" } },
    ]).exec();

    if (!result.length) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const { postOwner } = result[0];

    if (postOwner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.deleteOne({ _id: commentId });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
