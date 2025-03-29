import { useNavigate } from "react-router-dom";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { UserPosts } from "../../components/Posts";
import { UserProfileDetails } from "../../components/Profile";
import { FeedPost } from "../Home/hooks";
import {
  useDeletePost,
  useDeleteUserCommentPost,
  UserProfile,
  useUserPosts,
  useUserProfile,
} from "./hooks";

export default function MyProfile() {
  const { data, isError, isPending } = useUserProfile();
  const {
    data: posts,
    isError: isPostsError,
    isPending: isPostsPending,
  } = useUserPosts();
  const {
    invoke,
    isError: isDeleteError,
    isPending: isDeletePending,
  } = useDeletePost();
  const {
    invoke: deleteComment,
    isError: isDeleteCommentError,
    isPending: isDeleteCommentPending,
  } = useDeleteUserCommentPost();

  const onDeleteClick = (id: string) => {
    invoke(id);
  };

  if (isError || isDeleteError || isPostsError || isDeleteCommentError) {
    return <ErrorIndicator />;
  }

  if (
    isPending ||
    data === undefined ||
    isPostsPending ||
    posts === undefined
  ) {
    return <LoadingIndicator />;
  }

  return (
    <MyProfilePage
      user={data}
      posts={posts}
      onDeleteClick={onDeleteClick}
      isDeleting={isDeletePending}
      isCommentDeleting={isDeleteCommentPending}
      deleteComment={deleteComment}
    />
  );
}

function MyProfilePage({
  user,
  posts,
  onDeleteClick,
  isDeleting,
  isCommentDeleting,
  deleteComment,
}: {
  user: UserProfile;
  posts: FeedPost[];
  onDeleteClick: (id: string) => void;
  isDeleting: boolean;
  isCommentDeleting: boolean;
  deleteComment: (id: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center p-6 w-full bg-[#d8dada] min-h-screen">
      <UserProfileDetails
        user={user}
        onEditProfileClick={() => navigate("/profile/edit")}
      />
      <UserPosts
        posts={posts}
        onDeleteClick={onDeleteClick}
        onEditClick={(id) => navigate("/edit-post/" + id)}
        isDeleting={isDeleting}
        onDeleteCommentClick={(id: string) => deleteComment(id)}
        isCommentDeleting={isCommentDeleting}
      />
    </div>
  );
}
