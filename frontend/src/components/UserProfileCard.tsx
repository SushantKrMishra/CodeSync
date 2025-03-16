import { Avatar, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { UserProfile } from "../pages/Profile/hooks";
import { ConnectionStatus } from "../pages/UserDetails/hooks";

export const UserProfileCard = ({
  user,
  connectionStatus,
  followersCount,
  onConnectionAction,
}: {
  user: UserProfile;
  connectionStatus: ConnectionStatus;
  followersCount: number;
  onConnectionAction: () => void;
}) => {
  const getButtonConfig = () => {
    // TODO: Think of Remove connection
    switch (connectionStatus) {
      case ConnectionStatus.None:
        return { text: "Follow", variant: "contained", disabled: false };
      case ConnectionStatus.Pending:
        return { text: "Requested", variant: "outlined", disabled: true };
      case ConnectionStatus.Accepted:
        return { text: "Following", variant: "outlined", disabled: true };
      case ConnectionStatus.Rejected:
        return { text: "Follow", variant: "contained", disabled: true };
    }
  };

  const buttonConfig = getButtonConfig();

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

      <div className="flex gap-4 mb-4 mt-2">
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

        <div className="text-center ">
          <Typography variant="body2" color="#444" fontWeight={500}>
            {followersCount}
          </Typography>
          <Typography variant="caption" color="#666">
            Followers
          </Typography>
        </div>
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
          variant={buttonConfig.variant as "contained" | "outlined"}
          disabled={buttonConfig.disabled}
          onClick={onConnectionAction}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.875rem",
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
            bgcolor:
              connectionStatus === ConnectionStatus.Pending
                ? "rgba(255, 152, 0, 0.1)"
                : buttonConfig.variant === "contained"
                ? "#1976d2"
                : "transparent",
            color:
              connectionStatus === ConnectionStatus.Pending
                ? "#ff9800"
                : buttonConfig.variant === "contained"
                ? "white"
                : "#1976d2",
            border:
              connectionStatus === ConnectionStatus.Pending
                ? "1px solid #ff9800"
                : "1px solid #1976d2",
            "&:hover": {
              bgcolor:
                connectionStatus === ConnectionStatus.Pending
                  ? "rgba(255, 152, 0, 0.2)"
                  : buttonConfig.variant === "contained"
                  ? "#1565c0"
                  : "rgba(25, 118, 210, 0.1)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
              border: "none",
            },
          }}
        >
          {buttonConfig.text}
        </Button>
      </motion.div>
    </motion.div>
  );
};
