import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCommentDeleteHook,
  useCommentPostHook,
  useLikeHook,
} from "../domain/misc_hooks";
import { FeedComment, FeedPost } from "../pages/Home/hooks";

export function FeedPosts({
  posts,
  isSingleView,
}: {
  posts: FeedPost[];
  isSingleView?: boolean;
}) {
  const { invoke: likeHandler } = useLikeHook();
  const { invoke: postComment } = useCommentPostHook();
  const { invoke: deleteComment } = useCommentDeleteHook();
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
          onPostComment={async (comment: string) => {
            const data = await postComment({ postId: post._id, comment });
            return data ?? "tempID";
          }}
          isSingleView={isSingleView}
          onDeleteComment={(id: string) => deleteComment(id)}
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
  onPostComment,
  isSingleView,
  onDeleteComment,
}: {
  post: FeedPost;
  onLike: () => void;
  onUserClick: (userId: string) => void;
  onPostClick: () => void;
  onPostComment: (comment: string) => Promise<string>;
  onDeleteComment: (id: string) => void;
  isSingleView?: boolean;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likedCount);
  const [showComments, setShowComments] = useState(isSingleView ?? false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const commentsCount = useMemo(() => comments.length, [comments]);

  const handleLike = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    onLike();
  };

  const handleComment = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setShowComments((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      const id = await onPostComment(newComment.trim());
      const newTempComment: FeedComment = {
        _id: id,
        userId: {
          _id: "dummyID",
          lastName: "",
          userName: "",
          firstName: "You",
        },
        createdAt: new Date().toISOString(),
        isDeleteAllowed: true,
        userComment: newComment,
      };
      setComments((prev) => [newTempComment, ...prev]);
      setNewComment("");
    }
  };

  const onDeleteClick = (comment: FeedComment) => {
    onDeleteComment(comment._id);
    setComments((prev) => {
      return prev.filter((c) => c._id !== comment._id);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{ cursor: "pointer" }}
      onClick={onPostClick}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.12)" },
          maxWidth: "40rem",
          width: "100%",
          mx: "auto",
        }}
        className="mb-8"
      >
        {post.imageUrl && (
          <motion.div whileHover={{ scale: 1.02 }}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 200, sm: 300 },
                objectFit: "cover",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
              image={post.imageUrl}
              alt="Post image"
            />
          </motion.div>
        )}

        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                cursor: "pointer",
                bgcolor: "#212121",
              }}
            >
              {post.postedBy.firstName[0]}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onUserClick(post.postedBy._id);
                }}
              >
                {post.postedBy.firstName} {post.postedBy.lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", lineHeight: 1 }}
              >
                @{post.postedBy.userName}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.content}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2,
            }}
          >
            <Button
              size="small"
              startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
              onClick={handleLike}
              sx={{
                color: isLiked ? "error.main" : "text.secondary",
                minWidth: 80,
              }}
            >
              {likeCount}
            </Button>

            <Button
              size="small"
              startIcon={<ChatBubbleOutline />}
              sx={{ color: "text.secondary", minWidth: 80 }}
              onClick={handleComment}
            >
              {commentsCount}
            </Button>

            <Typography
              variant="caption"
              sx={{ color: "text.secondary", ml: "auto" }}
            >
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          {showComments && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                cursor: "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Comments ({commentsCount})
              </Typography>

              {comments.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    py: 2,
                  }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                (isSingleView ? comments : comments.slice(0, 2)).map(
                  (comment) => (
                    <Box
                      key={comment._id}
                      sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUserClick(comment.userId._id);
                          }}
                        >
                          {comment.userId.firstName} {comment.userId.lastName}
                        </Typography>
                        {comment.userId.userName && (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", ml: 1 }}
                          >
                            @{comment.userId.userName}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: "auto",
                          }}
                        >
                          {comment.isDeleteAllowed && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(comment);
                              }}
                              size="small"
                              sx={{ color: "text.secondary" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", ml: 1 }}
                          >
                            {new Date(comment.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        {comment.userComment}
                      </Typography>
                    </Box>
                  )
                )
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  "&:hover .MuiOutlinedInput-root": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      handleCommentSubmit();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 20,
                      backgroundColor: "action.hover",
                      "&.Mui-focused": {
                        backgroundColor: "background.paper",
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentSubmit();
                  }}
                  disabled={!newComment.trim()}
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: "#212121",
                    "&:disabled": {
                      backgroundColor: "action.disabledBackground",
                      color: "text.disabled",
                    },
                  }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
