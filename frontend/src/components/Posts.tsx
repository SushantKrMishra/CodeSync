import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { FeedPost } from "../pages/Home/hooks";
import ApplyModal from "./ApplyingModal";

export const UserPosts = ({
  posts,
  onDeleteClick,
  onEditClick,
  isDeleting,
  onDeleteCommentClick,
  isCommentDeleting,
}: {
  posts: FeedPost[];
  onDeleteClick: (postid: string) => void;
  onEditClick: (postid: string) => void;
  isDeleting: boolean;
  onDeleteCommentClick: (id: string) => void;
  isCommentDeleting: boolean;
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto mt-6"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
            className="mb-6 bg-white rounded-xl shadow-md overflow-hidden relative"
          >
            <motion.div
              className="absolute top-3 right-3 z-10 flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm"
              >
                <IconButton
                  aria-label="Edit post"
                  sx={{
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                  onClick={() => onEditClick(post._id)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm"
              >
                <IconButton
                  aria-label="Delete post"
                  sx={{
                    color: "#e53935",
                    "&:hover": {
                      backgroundColor: "rgba(229, 57, 53, 0.08)",
                    },
                  }}
                  onClick={() => onDeleteClick(post._id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </motion.div>
            </motion.div>

            <Card className="!rounded-xl !bg-transparent !shadow-none">
              {post.imageUrl && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    src={post.imageUrl}
                    alt="Post image"
                    className="object-cover cursor-pointer"
                  />
                </motion.div>
              )}

              <CardContent className="!px-4 !py-3">
                <Typography
                  variant="body1"
                  className="!text-[15px] !leading-snug"
                  color="#333"
                >
                  {post.content}
                </Typography>

                <Typography
                  variant="caption"
                  className="!block !mt-2 !text-gray-500"
                >
                  {new Date(post.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
            {post.comments.length > 0 && (
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderColor: "divider",
                  p: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Comments ({post.comments.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxHeight: 300, // Set max height for scrolling
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#ddd",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {post.comments.map((comment) => (
                    <Box
                      key={comment._id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        position: "relative",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "primary.main",
                          fontSize: "0.875rem",
                        }}
                      >
                        {comment.userId.firstName[0]}
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, mr: 1 }}
                          >
                            {comment.userId.firstName} {comment.userId.lastName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            @{comment.userId.userName}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.userComment}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>

                      <IconButton
                        aria-label="Delete comment"
                        onClick={() => onDeleteCommentClick(comment._id)}
                        sx={{
                          color: "error.main",
                          "&:hover": { bgcolor: "error.light" },
                          ml: "auto",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </motion.div>
        ))}
      </motion.div>
      <ApplyModal show={isDeleting} message="Processing post delete..." />
      <ApplyModal
        show={isCommentDeleting}
        message="Processing comment delete..."
      />
    </>
  );
};
