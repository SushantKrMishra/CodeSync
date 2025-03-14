import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MyProfilePageInfo, Post, UserProfile } from "../pages/Profile/hooks";

export default function MyProfilePage({ user, posts }: MyProfilePageInfo) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center p-6 w-full bg-[#d8dada] min-h-screen">
      <UserProfileDetails
        user={user}
        onEditProfileClick={() => navigate("/profile/edit")}
      />
      <UserPosts posts={posts} />
    </div>
  );
}

const UserProfileDetails = ({
  user,
  onEditProfileClick,
}: {
  user: UserProfile;
  onEditProfileClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center p-6 w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg backdrop-blur-sm"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Avatar
          sx={{
            width: 96,
            height: 96,
            mb: 2,
            bgcolor: "#1a1a1a",
            fontSize: "2.5rem",
            border: "3px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {user.firstName[0]}
        </Avatar>
      </motion.div>

      <Typography variant="h5" fontWeight={600} className="mb-1">
        {`${user.firstName} ${user.lastName}`}
      </Typography>

      <Typography variant="body2" color="#666" className="mb-4">
        @{user.userName}
      </Typography>

      <div className="flex gap-4 mb-4">
        {user.age && (
          <div className="text-center">
            <Typography variant="body2" color="#444" fontWeight={500}>
              {user.age}
            </Typography>
            <Typography variant="caption" color="#666">
              Age
            </Typography>
          </div>
        )}

        {user.gender && (
          <div className="text-center">
            <Typography variant="body2" color="#444" fontWeight={500}>
              {user.gender}
            </Typography>
            <Typography variant="caption" color="#666">
              Gender
            </Typography>
          </div>
        )}
      </div>

      {user.about && (
        <Typography
          variant="body1"
          className="text-center px-4 py-2 bg-gray-50 rounded-lg max-w-md"
          color="#333"
        >
          {user.about}
        </Typography>
      )}

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4"
      >
        <Button
          variant="contained"
          onClick={onEditProfileClick}
          sx={{
            bgcolor: "#1976d2",
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.875rem",
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
            "&:hover": {
              bgcolor: "#1565c0",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            },
          }}
        >
          Edit Profile
        </Button>
      </motion.div>
    </motion.div>
  );
};

const UserPosts = ({ posts }: { posts: Post[] }) => {
  return (
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
  );
};
