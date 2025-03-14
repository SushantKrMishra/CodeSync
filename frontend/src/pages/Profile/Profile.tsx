import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import MyProfilePage from "../../components/Profile";
import { useUserProfilePageInfo } from "./hooks";

export default function MyProfile() {
  const { data, isError, isPending } = useUserProfilePageInfo();

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return <MyProfilePage user={data.user} posts={data.posts} />;
}
