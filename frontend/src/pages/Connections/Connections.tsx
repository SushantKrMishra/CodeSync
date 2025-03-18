import { Avatar, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ConnectionUser } from "../ConnectionSuggestion/hooks";
import {
  useHandleConnectionRequest,
  useRecievedConnectionRequest,
  useSendConnectionRequest,
  useWithdrawConnectionRequest,
} from "./hooks";

export const Connections = () => {
  const {
    data: received,
    isError: isRecievedError,
    isPending: isRecievedPending,
  } = useRecievedConnectionRequest();
  const {
    data: send,
    isError: isSendError,
    isPending: isSendPending,
  } = useSendConnectionRequest();
  const {
    invoke: withdrawRequest,
    isError: isWithdrawError,
    isPending: isWithdrawing,
  } = useWithdrawConnectionRequest();
  const {
    invoke: handleConnection,
    isError: isHandlingError,
    isPending: isHandlingPending,
  } = useHandleConnectionRequest();
  const navigate = useNavigate();

  const onAcceptConnection = (id: string) => {
    handleConnection({ id, status: "accepted" });
  };

  const onRejectConnection = (id: string) => {
    handleConnection({ id, status: "rejected" });
  };

  if (isRecievedError || isSendError || isWithdrawError || isHandlingError) {
    return <ErrorIndicator />;
  }

  if (
    isRecievedPending ||
    received === undefined ||
    isSendPending ||
    send === undefined
  ) {
    return <LoadingIndicator />;
  }

  return (
    <ConnectionsView
      received={received}
      onAccept={onAcceptConnection}
      onIgnore={onRejectConnection}
      onWithdraw={(id) => withdrawRequest(id)}
      sent={send}
      isProcessing={isWithdrawing || isHandlingPending}
      navigate={navigate}
    />
  );
};

interface Props {
  received: ConnectionUser[];
  sent: ConnectionUser[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onWithdraw: (id: string) => void;
  isProcessing: boolean;
  navigate: NavigateFunction;
}

export const ConnectionsView = ({
  received,
  sent,
  onAccept,
  onIgnore,
  onWithdraw,
  isProcessing,
  navigate,
}: Props) => {
  return (
    <>
      <div className="p-4 md:p-6 bg-[#d8dada] min-h-screen">
        <div className="w-full max-w-3xl mx-auto space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <Typography
                variant="h4"
                fontWeight={700}
                className="text-gray-800 mb-4"
              >
                Received Requests
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-32 mt-2 rounded-full"
                />
              </Typography>
            </div>

            {received.length === 0 ? (
              <Typography variant="body1" className="text-center text-gray-600">
                No pending requests
              </Typography>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {received.map((user, index) => (
                  <ConnectionRequest
                    key={user._id}
                    user={user}
                    index={index}
                    type="received"
                    onAction1={() => onAccept(user._id)}
                    onAction2={() => onIgnore(user._id)}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-8">
              <Typography
                variant="h4"
                fontWeight={700}
                className="text-gray-800 mb-4"
              >
                Sent Requests
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-1 bg-gradient-to-r from-green-500 to-cyan-600 w-32 mt-2 rounded-full"
                />
              </Typography>
            </div>

            {sent.length === 0 ? (
              <Typography variant="body1" className="text-center text-gray-600">
                No sent requests
              </Typography>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {sent.map((user, index) => (
                  <ConnectionRequest
                    key={user._id}
                    user={user}
                    index={index}
                    type="sent"
                    onAction1={() => onWithdraw(user._id)}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
      <ApplyModal show={isProcessing} message="Processing your request..." />
    </>
  );
};

const ConnectionRequest = ({
  user,
  index,
  type,
  onAction1,
  onAction2,
  navigate,
}: {
  user: ConnectionUser;
  index: number;
  type: "received" | "sent";
  onAction1: () => void;
  onAction2?: () => void;
  navigate: NavigateFunction;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
    className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <div
      className="flex items-start p-4 md:p-6 gap-4 cursor-pointer"
      onClick={() => navigate("/user-profile/" + user._id)}
    >
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

      <div className="flex flex-col md:flex-row gap-2 min-w-[120px]">
        {type === "received" ? (
          <>
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onAction1();
              }}
              sx={{
                bgcolor: "#4f46e5",
                backgroundImage:
                  "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "12px",
                px: 2,
                py: 1,
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                if (onAction2 !== undefined) {
                  onAction2();
                }
              }}
              sx={{
                border: "2px solid #ef4444",
                color: "#ef4444",
                borderRadius: "12px",
                px: 2,
                py: 1,
                textTransform: "none",
                fontSize: "0.875rem",
                "&:hover": {
                  border: "2px solid #dc2626",
                },
              }}
            >
              Ignore
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onAction1();
            }}
            sx={{
              border: "2px solid #8b5cf6",
              color: "#8b5cf6",
              borderRadius: "12px",
              px: 2,
              py: 1,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                border: "2px solid #6d28d9",
              },
            }}
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  </motion.div>
);
