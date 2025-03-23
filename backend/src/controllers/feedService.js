import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/posts.js";

export const feeds = async (req, res) => {
  try {
    let page = Math.min(parseInt(req.query.page) || 1, 15);
    let limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const posts = await Post.aggregate([
      { $match: { postedBy: { $ne: userId } } },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
            {
              $group: {
                _id: null,
                likedCount: { $sum: 1 },
                users: { $push: "$userId" },
              },
            },
          ],
          as: "likesData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
        },
      },
      { $unwind: "$postedBy" },
      {
        $project: {
          _id: 1,
          imageUrl: 1,
          content: 1,
          updatedAt: 1,
          postedBy: { firstName: 1, lastName: 1, userName: 1, _id: 1 },
          likedCount: {
            $ifNull: [{ $arrayElemAt: ["$likesData.likedCount", 0] }, 0],
          },
          isLiked: {
            $in: [
              userId,
              { $ifNull: [{ $arrayElemAt: ["$likesData.users", 0] }, []] },
            ],
          },
        },
      },
    ]);

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
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
    const { content } = req.body;
    const imageUrl = req.file?.path;

    if (!imageUrl && !content) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const post = await Post.create({
      imageUrl,
      content,
      postedBy: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findOneAndDelete({
      _id: postId,
      postedBy: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the Cloudinary image if it exists
    const publicId = post.imageUrl?.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`posts/${publicId}`);
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;
    const imageUrl = req.file?.path;

    if (!content && !imageUrl) {
      return res.status(400).json({ message: "Bad request" });
    }

    const post = await Post.findOne({ _id: postId, postedBy: req.user._id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let newImageUrl = post.imageUrl;

    // If a new image is provided, upload it to Cloudinary
    if (imageUrl) {
      // Delete old image from Cloudinary (if it exists)
      if (post.imageUrl) {
        const publicId = post.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      }

      // Upload new image
      const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: "posts",
        resource_type: "image",
      });

      newImageUrl = uploadedResponse.secure_url;
    } else if (!imageUrl) {
      // If imageFile is null, remove the existing image
      if (post.imageUrl) {
        const publicId = post.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`posts/${publicId}`);
        newImageUrl = null;
      }
    }

    // Update the post
    post.content = content || post.content;
    post.imageUrl = newImageUrl;
    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const userId = req.user._id;

    const post = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
            {
              $group: {
                _id: null,
                likedCount: { $sum: 1 },
                users: { $push: "$userId" },
              },
            },
          ],
          as: "likesData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
        },
      },
      { $unwind: "$postedBy" },
      {
        $project: {
          _id: 1,
          imageUrl: 1,
          content: 1,
          updatedAt: 1,
          postedBy: { firstName: 1, lastName: 1, userName: 1, _id: 1 },
          likedCount: {
            $ifNull: [{ $arrayElemAt: ["$likesData.likedCount", 0] }, 0],
          },
          isLiked: {
            $in: [
              userId,
              { $ifNull: [{ $arrayElemAt: ["$likesData.users", 0] }, []] },
            ],
          },
        },
      },
    ]);

    if (!post.length) {
      return res.status(204).json({ message: "No post found" });
    }

    const postData = post[0];
    const isEditingAllowed = userId.equals(postData.postedBy._id);

    res.status(200).json({
      isEditingAllowed,
      ...postData,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
