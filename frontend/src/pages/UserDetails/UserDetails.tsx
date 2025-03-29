import {
  ChatBubbleOutline,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { UserNotFound } from "../../components/UserNotFound";
import { UserProfileCard } from "../../components/UserProfileCard";
import {
  useCommentDeleteHook,
  useCommentPostHook,
  useLikeHook,
} from "../../domain/misc_hooks";
import {
  useHandleConnectionRequest,
  useWithdrawConnectionRequest,
} from "../ConnectionsReqests/hooks";
import { useSendConnectionRequest } from "../ConnectionSuggestion/hooks";
import { FeedComment, FeedPost } from "../Home/hooks";
import { UserProfile } from "../Profile/hooks";
import { ConnectionStatus, UserDetailsInfo, useUserDetails } from "./hooks";

const UserDetails = () => {
  const params = useParams();
  const { id } = params;
  const { data, isError, isFetching } = useUserDetails(id);
  const { invoke } = useLikeHook();
  const { invoke: postComment } = useCommentPostHook();
  const { invoke: deleteComment } = useCommentDeleteHook();
  const {
    invoke: withdrawConnection,
    isError: isWithdrawError,
    isPending: isWithdrawing,
  } = useWithdrawConnectionRequest();
  const {
    invoke: sendConnection,
    isError: isSendError,
    isPending: isSending,
  } = useSendConnectionRequest();
  const {
    invoke: handleConnection,
    isError: isHandleError,
    isPending: isHandling,
  } = useHandleConnectionRequest();

  const onConnectionAction = async (action: string) => {
    const currentConnectionStatus = (data as UserDetailsInfo)!.connectionStatus;
    if (currentConnectionStatus === ConnectionStatus.Pending) {
      await withdrawConnection(id!);
    } else if (currentConnectionStatus === ConnectionStatus.None) {
      sendConnection(id!);
    } else if (currentConnectionStatus === ConnectionStatus.Recieved) {
      handleConnection({
        id: id!,
        status: action === "Accept" ? "accepted" : "rejected",
      });
    }
    return;
  };

  if (isError || isWithdrawError || isSendError || isHandleError) {
    return <ErrorIndicator />;
  }

  if (isFetching || data === undefined) {
    return <LoadingIndicator />;
  }

  if (data === "not-found" || id === undefined || id.trim() === "") {
    return <UserNotFound />;
  }

  return (
    <UserDetailsView
      posts={data.posts}
      user={data.user}
      connectionStatus={data.connectionStatus}
      invoke={invoke}
      postComment={postComment}
      deleteComment={deleteComment}
      onConnectionAction={onConnectionAction}
      isConnectionPending={isSending || isWithdrawing || isHandling}
    />
  );
};

export default UserDetails;

type Props = {
  posts: FeedPost[];
  user: UserProfile;
  invoke: (input: string) => void;
  connectionStatus: ConnectionStatus;
  postComment: (input: {
    postId: string;
    comment: string;
  }) => Promise<string | undefined>;
  deleteComment: (input: string) => Promise<void | undefined>;
  onConnectionAction: (action: string) => void;
  isConnectionPending: boolean;
};

const UserDetailsView: React.FC<Props> = ({
  posts,
  user,
  connectionStatus,
  invoke: likeHandler,
  postComment,
  deleteComment,
  onConnectionAction,
  isConnectionPending,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isSelf) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <>
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
        <UserProfileCard
          user={user}
          connectionStatus={connectionStatus}
          isConnectionPending={isConnectionPending}
          onConnectionAction={onConnectionAction}
        />
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={() => likeHandler(post._id)}
            onPostClick={(id) => navigate("/view-post/" + id)}
            onDeleteComment={(id: string) => deleteComment(id)}
            onPostComment={async (comment: string) => {
              const data = await postComment({ postId: post._id, comment });
              return data ?? "tempID";
            }}
            onUserClick={(id: string) => navigate("/user-profile/" + id)}
          />
        ))}
      </Box>
    </>
  );
};

const PostCard = ({
  post,
  onLike,
  onPostComment,
  onDeleteComment,
  onPostClick,
  onUserClick,
}: {
  post: FeedPost;
  onLike: () => void;
  onPostComment: (comment: string) => Promise<string>;
  onDeleteComment: (id: string) => void;
  onPostClick: (id: string) => void;
  onUserClick: (id: string) => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likedCount ?? 0);
  const [comments, setComments] = useState(post.comments ?? []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentsCount = useMemo(() => comments.length, [comments]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    onLike();
  };

  const handleCommentToggle = (e: React.MouseEvent) => {
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
    setComments((prev) => prev.filter((c) => c._id !== comment._id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="mb-6 bg-white rounded-xl shadow-md overflow-hidden relative cursor-pointer"
    >
      <Card
        className="!rounded-xl !bg-transparent !shadow-none"
        onClick={() => onPostClick(post._id)}
      >
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
          <Typography
            variant="body1"
            className="!text-[15px] !leading-snug mb-3"
          >
            {post.content}
          </Typography>

          <Box className="flex items-center gap-4 border-t border-gray-100 pt-3">
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

            <div className="flex items-center gap-1">
              <IconButton
                aria-label="Comment"
                size="small"
                onClick={handleCommentToggle}
              >
                <ChatBubbleOutline />
              </IconButton>
              <Typography variant="caption">{commentsCount}</Typography>
            </div>

            <Typography variant="caption" className="!ml-auto !text-gray-500">
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
              className="mt-3 pt-3 border-t border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="subtitle2" className="!font-semibold mb-2">
                Comments ({commentsCount})
              </Typography>

              {comments.length === 0 ? (
                <Typography className="!text-center !text-gray-500 !py-2">
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                <Box className="space-y-3">
                  {comments.map((comment) => (
                    <Box
                      key={comment._id}
                      className="p-2 rounded-lg bg-gray-50"
                    >
                      <Box className="flex items-center gap-2 mb-1">
                        <Typography
                          variant="body2"
                          className="!font-medium !cursor-pointer hover:underline"
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
                            className="!text-gray-500"
                          >
                            @{comment.userId.userName}
                          </Typography>
                        )}
                        <Box className="ml-auto flex items-center gap-1">
                          {comment.isDeleteAllowed && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(comment);
                              }}
                              className="!text-gray-500"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                          <Typography
                            variant="caption"
                            className="!text-gray-500"
                          >
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        className="!break-words !whitespace-pre-wrap"
                      >
                        {comment.userComment}
                      </Typography>
                    </Box>
                  ))}
                </Box>
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
