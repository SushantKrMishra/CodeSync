import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import ErrorIndicator from "../../components/ErrorIndicator";
import { FeedPosts } from "../../components/FeedPosts";
import LoadingIndicator from "../../components/LoadingIndicator";
import { FeedPost, useFeeds } from "./hooks";

export const Home = () => {
  const {
    data,
    isError,
    isPending,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeeds();

  const { ref, inView } = useInView();

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  useEffect(() => {
    let timer: number;
    if (inView && hasNextPage && !isFetchingNextPage) {
      timer = setTimeout(() => {
        fetchNextPage();
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <HomeView
      posts={posts}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      sentinelRef={ref}
    />
  );
};

type Props = {
  posts: FeedPost[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  sentinelRef: (node?: Element | null | undefined) => void;
};

const HomeView: React.FC<Props> = ({
  posts,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  sentinelRef,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <FeedPosts posts={posts} />

      <Box
        ref={sentinelRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
          height: "100px",
        }}
      >
        {isFetchingNextPage ? (
          <CircularProgress />
        ) : hasNextPage ? (
          <Typography color="text.secondary">
            Scroll down to load more
          </Typography>
        ) : (
          <Typography color="text.secondary">No more posts to show</Typography>
        )}
      </Box>

      {isFetching && posts.length === 0 && <LoadingIndicator />}
    </Box>
  );
};
