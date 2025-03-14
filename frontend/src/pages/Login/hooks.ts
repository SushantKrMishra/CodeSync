import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi } from "../../data/auth";
import { MutationHookData } from "../../domain/hook_data";
import { deriveMutationState } from "../../domain/hook_impl";

export type LoginFormState = {
  emailId: string;
  password: string;
};

export function useLogin(): MutationHookData<LoginFormState, void> {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginApi,
    onSuccess: async () => {
      await client.setQueryData(["sessionStatus"], true);
    },
  });

  return deriveMutationState(mutation);
}

export function useLogout(): MutationHookData<void, void> {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutApi,
    onSuccess: async () => {
      await client.setQueryData(["sessionStatus"], false);
    },
  });

  return deriveMutationState(mutation);
}
