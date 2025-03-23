import { Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ConnectionUser } from "../ConnectionSuggestion/hooks";
import { UserProfile } from "../Profile/hooks";
import { useConnections } from "./hooks";

const Connections = () => {
  const { data, isPending, isError } = useConnections();

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return <ConnectionsView users={data} />;
};

export default Connections;

type Props = {
  users: ConnectionUser[];
};

const ConnectionsView: React.FC<Props> = ({ users }) => {
  const navigate = useNavigate();

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
              Connections
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
                🧐 No Connections available at the moment
              </Typography>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {users.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  index={index}
                  onUserClick={() => navigate("/user-profile/" + user._id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

const UserCard = ({
  user,
  index,
  onUserClick,
}: {
  user: UserProfile;
  index: number;
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
    </div>
  </motion.div>
);
