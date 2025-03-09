import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  HookError,
  HookStatus,
  MutationHookData,
  QueryHookData,
} from "./hook_data";

/**
 * Aggregates query results and their dependencies to determine the final status, error, and fetching state.
 *
 * @template O - The type of the query data.
 * @param {UseQueryResult<O | null, Error>} queryResult - The primary query result.
 * @param {QueryHookData<unknown> | QueryHookData<unknown>[]} [dependencies] - Optional dependencies whose status, error, and fetching state contribute to the final result.
 * @returns {QueryHookData<O>} - An object containing the aggregated status, error, and fetching state, along with helper flags and a refetch function.
 */
export function deriveQueryState<O>(
  queryResult: UseQueryResult<O | null, Error>,
  dependencies?: QueryHookData<unknown> | QueryHookData<unknown>[]
): QueryHookData<O> {
  let status: HookStatus = queryResult.status;
  let error = findFirstValidError(queryResult.error);
  let isFetching = queryResult.isFetching;

  if (dependencies !== undefined) {
    if (Array.isArray(dependencies)) {
      status = determineOverallStatus([
        queryResult.status,
        ...dependencies.flatMap((dep) => dep.status),
      ]);
      error = findFirstValidError([
        queryResult.error,
        ...dependencies.flatMap((dep) => dep.error),
      ]);
      isFetching = isFetchingStateActive([
        queryResult.isFetching,
        ...dependencies.flatMap((dep) => dep.isFetching),
      ]);
    } else {
      status = determineOverallStatus([
        queryResult.status,
        dependencies.status,
      ]);
      error = findFirstValidError([queryResult.error, dependencies.error]);
      isFetching = isFetchingStateActive([
        queryResult.isFetching,
        dependencies.isFetching,
      ]);
    }
  }

  return {
    status,
    data: queryResult.data ?? undefined,
    error,
    isFetching,
    refetch: queryResult.refetch,
    isPending: status === "pending",
    isError: status === "error",
    isSuccess: status === "success",
  };
}

/**
 * Extracts and normalizes mutation results into a consistent data structure.
 *
 * @template I - The type of input data for the mutation.
 * @template O - The type of output data for the mutation.
 * @param {UseMutationResult<O, Error, I, unknown>} mutationResult - The mutation result.
 * @returns {MutationHookData<I, O>} - An object containing the mutation status, data, error, and an invoke function.
 */
export function deriveMutationState<I, O>(
  mutationResult: UseMutationResult<O, Error, I, unknown>
): MutationHookData<I, O> {
  const status = determineOverallStatus(mutationResult.status);
  return {
    status,
    data: mutationResult.data,
    error: findFirstValidError(mutationResult.error),
    isPending: status === "pending",
    isError: status === "error",
    isSuccess: status === "success",
    invoke: mutationResult.mutateAsync,
  };
}

/**
 * Determines the overall status from a given hook status or an array of hook statuses.
 *
 * @param {HookStatus | HookStatus[]} statuses - A single status or an array of statuses to evaluate.
 * @returns {HookStatus} - The overall hook status based on the following rules:
 *   - If `statuses` is an array:
 *     - Throws an error if the array is empty.
 *     - Returns `"error"` if any element is `"error"`.
 *     - Returns `"idle"` if any element is `"idle"` (but none are `"error"`).
 *     - Returns `"pending"` if any element is `"pending"` (but none are `"error"` or `"idle"`).
 *     - Returns `"success"` if all elements are `"success"`.
 *   - If `statuses` is a single value, it is returned as is.
 *
 * @throws {Error} If an empty array is provided.
 */
function determineOverallStatus(
  statuses: HookStatus | HookStatus[]
): HookStatus {
  if (Array.isArray(statuses)) {
    if (statuses.length === 0) {
      throw new Error("Expected at least one status value.");
    }
    if (statuses.includes("error")) return "error";
    if (statuses.includes("idle")) return "idle";
    if (statuses.includes("pending")) return "pending";
    return "success";
  }
  return statuses;
}

/**
 * Finds the first non-null, non-undefined error from a given error or an array of errors.
 *
 * @param {HookError | HookError[]} errors - A single error or an array of errors.
 * @returns {Error | undefined} - The first encountered error if present, otherwise `undefined`.
 */
function findFirstValidError(
  errors: HookError | HookError[]
): Error | undefined {
  if (Array.isArray(errors)) {
    return errors.find((error) => error !== null && error !== undefined);
  }
  return errors ?? undefined;
}

/**
 * Determines whether all fetching states are active (`true`).
 *
 * @param {boolean | boolean[]} fetchingStates - A single fetching status or an array of statuses.
 * @returns {boolean} - `true` if all values in the array are `true`, otherwise `false`.
 */
function isFetchingStateActive(fetchingStates: boolean | boolean[]): boolean {
  if (Array.isArray(fetchingStates)) {
    return fetchingStates.every(Boolean);
  }
  return fetchingStates;
}
