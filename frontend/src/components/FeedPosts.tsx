import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLikeHook } from "../domain/misc_hooks";
import { FeedPost } from "../pages/Home/hooks";

export function FeedPosts({ posts }: { posts: FeedPost[] }) {
  const { invoke: likeHandler } = useLikeHook();
  const navigate = useNavigate();
  const onUserClick = (userId: string) => {
    navigate("/user-profile/" + userId);
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(1, 1fr)",
          lg: "repeat(1, 1fr)",
        },
        gap: 3,
        maxWidth: "40rem",
        mx: "auto",
      }}
    >
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onUserClick={onUserClick}
          onPostClick={() => navigate("/view-post/" + post._id)}
          onLike={() => likeHandler(post._id)}
        />
      ))}
    </Box>
  );
}

const PostCard = ({
  post,
  onLike,
  onUserClick,
  onPostClick,
}: {
  post: FeedPost;
  onLike: () => void;
  onUserClick: (userId: string) => void;
  onPostClick: () => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likedCount);

  const handleLike = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    onLike();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="mb-6 bg-white rounded-xl shadow-md overflow-hidden relative cursor-pointer"
      onClick={onPostClick}
    >
      <Card className="!rounded-xl !bg-transparent !shadow-none">
        {post.imageUrl && (
          <motion.div whileHover={{ scale: 1.02 }}>
            <CardMedia
              component="img"
              height="400"
              image={post.imageUrl}
              alt="Post image"
              className="object-cover cursor-pointer"
            />
          </motion.div>
        )}

        <CardContent className="!px-4 !py-3">
          <div className="flex items-center gap-2 mb-2 ">
            <Typography
              variant="subtitle2"
              className="!font-medium cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick(post.postedBy._id);
              }}
            >
              {post.postedBy.firstName} {post.postedBy.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary cursor-pointer">
              @{post.postedBy.userName}
            </Typography>
          </div>

          <Typography variant="body1" className="!text-[15px] !leading-snug">
            {post.content}
          </Typography>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <IconButton
                aria-label="Like post"
                size="small"
                onClick={handleLike}
                color={isLiked ? "error" : "default"}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="caption">{likeCount}</Typography>
            </div>

            <IconButton
              aria-label="Comment"
              size="small"
              disabled
              className="!text-gray-400"
            >
              <ChatBubbleOutline />
            </IconButton>
          </div>

          <Typography variant="caption" className="!block !mt-2 !text-gray-500">
            {new Date(post.updatedAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
