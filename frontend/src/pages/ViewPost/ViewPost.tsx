import { useParams } from "react-router-dom";
import ErrorIndicator from "../../components/ErrorIndicator";
import { FeedPosts } from "../../components/FeedPosts";
import LoadingIndicator from "../../components/LoadingIndicator";
import { PostNotFound } from "../../components/PostNotFound";
import { usePost } from "../EditPost/hooks";

const ViewPost = () => {
  const { id } = useParams();
  const { data, isPending, isError } = usePost(id);

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  if (id === undefined || id.trim() === "" || data === "not-found") {
    return <PostNotFound />;
  }

  return <FeedPosts posts={[data]} isSingleView={true} />;
};

export default ViewPost;
