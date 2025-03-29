import { Avatar, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { UserProfile } from "../pages/Profile/hooks";
import { ConnectionStatus } from "../pages/UserDetails/hooks";
import ApplyModal from "./ApplyingModal";

export const UserProfileCard = ({
  user,
  connectionStatus,
  onConnectionAction,
  isConnectionPending,
}: {
  user: UserProfile;
  connectionStatus: ConnectionStatus;
  onConnectionAction: (action: string) => void;
  isConnectionPending: boolean;
}) => {
  const getButtonConfig = (): {
    text: string;
    variant: "contained" | "outlined" | "text";
    color?: "primary" | "success" | "error";
    disabled?: boolean;
  }[] => {
    switch (connectionStatus) {
      case ConnectionStatus.None:
        return [{ text: "Follow", variant: "contained" }];
      case ConnectionStatus.Pending:
        return [{ text: "Requested", variant: "outlined" }];
      case ConnectionStatus.Accepted:
        return [{ text: "Following", variant: "outlined" }];
      case ConnectionStatus.Rejected:
        return [{ text: "Follow", variant: "contained", disabled: true }];
      case ConnectionStatus.Recieved:
        return [
          { text: "Accept", variant: "contained", color: "success" },
          { text: "Reject", variant: "outlined", color: "error" },
        ];
      default:
        return [];
    }
  };

  const buttonConfigs = getButtonConfig();

  return (
    <>
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
              {user.postCount ?? 0}
            </Typography>
            <Typography variant="caption" color="#666">
              Posts
            </Typography>
          </div>

          <div className="text-center ">
            <Typography variant="body2" color="#444" fontWeight={500}>
              {user.followersCount ?? 0}
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

        <div className="mt-4 flex gap-3">
          {buttonConfigs.map((config) => (
            <motion.div
              key={config.text}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant={config.variant}
                color={config.color || "primary"}
                onClick={(event) => {
                  event.preventDefault();
                  onConnectionAction(config.text);
                }}
                disabled={config.disabled || false}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  ...(config.color === "error" && {
                    border: "1px solid",
                    borderColor: "error.main",
                    color: "error.main",
                  }),
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    ...(config.color === "error" && {
                      backgroundColor: "error.light",
                      color: "error.dark",
                    }),
                    ...(config.color === "success" && {
                      backgroundColor: "success.dark",
                    }),
                  },
                  ...(config.color === "success" && {
                    backgroundColor: "success.main",
                    color: "#fff",
                  }),
                }}
              >
                {config.text}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <ApplyModal
        show={isConnectionPending}
        message="Processing your request..."
      />
    </>
  );
};
