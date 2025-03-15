import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (err, query) => {
      //TODO: Add a logger here
      console.log(`Query with key ${query.queryKey} failed - ${err.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (err, _, __, mutation) => {
      //TODO: Add a logger here
      console.log(
        `Mutation with key ${mutation.options.mutationKey} failed - ${err.message}`
      );
    },
  }),
});
