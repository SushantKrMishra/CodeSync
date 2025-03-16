import { Post } from "../models/posts.js";

export const feeds = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    page = Math.min(page, 15);
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;
    let posts = await Post.find({ postedBy: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-createdAt -__v")
      .populate(["postedBy"], "firstName lastName userName");

    posts = posts.sort(() => Math.random() - 0.5);
    res.status(200).json({ posts });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const data = await Post.find({ postedBy: req.user._id }, "-postedBy -__v")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ data });
  } catch (err) {
    // TODO: Add proper logging for errors
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    if (!content && !imageUrl) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const post = new Post({
      imageUrl: imageUrl,
      postedBy: req.user._id,
      content: content,
    });
    const data = await post.save();
    res.status(201).json({
      data,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const post = await Post.findOneAndDelete({
      _id: postId,
      postedBy: req.user._id,
    });
    if (!post) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content, imageUrl } = req.body;
    if (!content && !imageUrl) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, postedBy: req.user._id },
      {
        content,
        imageUrl,
      },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    if (!postId) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const post = await Post.findById(postId)
      .select("-__v -createdAt")
      .populate("postedBy", "firstName lastName userName");
    if (!post) {
      return res.status(204).json({
        message: "No post found",
      });
    }

    const isEditingAllowed = req.user._id.equals(post.postedBy._id);
    res.status(200).json({
      isEditingAllowed,
      _id: post._id,
      imageUrl: post.imageUrl,
      postedBy: post.postedBy,
      content: post.content,
      updatedAt: post.updatedAt,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
