import { Like } from "../models/like.js";
import { Post } from "../models/posts.js";

export const likeHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(400).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: "Post unliked successfully" });
    }

    await Like.create({ userId, postId });

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
