import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../../data/signup";
import { MutationHookData } from "../../domain/hook_data";
import { deriveMutationState } from "../../domain/hook_impl";

export type SignUpFormState = {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
};

export function useSignup(): MutationHookData<SignUpFormState, void> {
  const mutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: signupApi,
  });

  return deriveMutationState(mutation);
}
