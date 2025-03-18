import { Avatar, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { UserProfile } from "../Profile/hooks";
import {
  ConnectionUser,
  useConnectionSuggestion,
  useSendConnectionRequest,
} from "./hooks";

export const ConnectionsSuggestions = () => {
  const { data, isPending, isError } = useConnectionSuggestion();
  const {
    invoke,
    isPending: isConnecting,
    isError: isConnectionError,
  } = useSendConnectionRequest();
  const navigate = useNavigate();

  const handleFollow = (userId: string) => {
    invoke(userId);
  };

  if (isError || isConnectionError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <ConnectionSuggestionsView
      users={data}
      handleFollow={handleFollow}
      navigate={navigate}
      isConnecting={isConnecting}
    />
  );
};

const ConnectionSuggestionsView: React.FC<{
  users: ConnectionUser[];
  handleFollow: (userId: string) => void;
  navigate: NavigateFunction;
  isConnecting: boolean;
}> = ({ users, handleFollow, navigate, isConnecting }) => {
  return (
    <>
      <div className="p-4 md:p-6 bg-[#d8dada] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <Typography
              variant="h4"
              fontWeight={700}
              className="text-gray-800 mb-4"
            >
              Connection Suggestions
            </Typography>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="h-1 mt-1 bg-gradient-to-r from-blue-500 to-purple-600 w-60 mx-auto rounded-full origin-center"
            />
          </motion.div>

          {users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-white rounded-xl shadow-sm"
            >
              <Typography variant="body1" color="textSecondary">
                🧐 No suggestions available at the moment
              </Typography>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {users.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  index={index}
                  onFollow={() => handleFollow(user._id)}
                  onUserClick={() => navigate("/user-profile/" + user._id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <ApplyModal show={isConnecting} message="Sending connection request..." />
    </>
  );
};

const UserCard = ({
  user,
  index,
  onFollow,
  onUserClick,
}: {
  user: UserProfile;
  index: number;
  onFollow: () => void;
  onUserClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
    whileHover={{ y: -4 }}
    className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onUserClick}
  >
    <div className="flex items-start p-4 md:p-6 gap-4">
      <motion.div whileHover={{ scale: 1.05 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#1a1a1a",
            fontSize: "1.5rem",
            border: "2px solid #fff",
          }}
        >
          {user.firstName[0]}
        </Avatar>
      </motion.div>

      <div className="flex-1 min-w-0">
        <Typography variant="h6" fontWeight={600} className="truncate">
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="mb-2 truncate"
        >
          @{user.userName}
        </Typography>
        {user.about && (
          <Typography
            variant="body2"
            color="textSecondary"
            className="line-clamp-2"
          >
            {user.about}
          </Typography>
        )}
      </div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            onFollow();
          }}
          sx={{
            bgcolor: "#4f46e5",
            backgroundImage: "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "12px",
            px: 3,
            py: 1,
            minWidth: 100,
            textTransform: "none",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            },
          }}
        >
          Follow
        </Button>
      </motion.div>
    </div>
  </motion.div>
);
