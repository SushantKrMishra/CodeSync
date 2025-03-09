export type HookStatus = "pending" | "idle" | "error" | "success";

export type HookError = Error | null | undefined;

type BaseHookData<O> = {
  readonly data?: O;
  readonly status: HookStatus;
  readonly error: HookError;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
};

//For Async Operations
export type QueryHookData<O> = {
  isFetching: boolean;
  refetch: () => void;
} & BaseHookData<O>;

export type MutationHookData<I, O> = {
  invoke(input: I): Promise<O | undefined>;
} & BaseHookData<O>;
