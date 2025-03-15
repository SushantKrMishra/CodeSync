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
import { FeedPost } from "../pages/Home/hooks";

export function FeedPosts({ posts }: { posts: FeedPost[] }) {
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
        <PostCard key={post._id} post={post} />
      ))}
    </Box>
  );
}

const PostCard = ({
  post,
  onLike,
}: {
  post: FeedPost;
  onLike?: (postId: string) => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    onLike?.(post._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="mb-6 bg-white rounded-xl shadow-md overflow-hidden relative"
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
          <div className="flex items-center gap-2 mb-2">
            <Typography variant="subtitle2" className="!font-medium">
              {post.postedBy.firstName} {post.postedBy.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
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
