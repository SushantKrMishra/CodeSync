import { Delete, Edit } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Post } from "../pages/Profile/hooks";
import ApplyModal from "./ApplyingModal";

export const UserPosts = ({
  posts,
  onDeleteClick,
  onEditClick,
  isDeleting,
}: {
  posts: Post[];
  onDeleteClick: (postid: string) => void;
  onEditClick: (postid: string) => void;
  isDeleting: boolean;
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
                    image={post.imageUrl}
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
          </motion.div>
        ))}
      </motion.div>
      <ApplyModal show={isDeleting} message="Processing post delete..." />
    </>
  );
};
