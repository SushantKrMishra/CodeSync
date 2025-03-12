import { AxiosError } from "axios";

export const validateEmailId = (id: string): boolean => {
  return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(id);
};

export function mapAndThrowError(e: unknown): never {
  if (e instanceof AxiosError) {
    throw new Error(
      `${e.name} ${e.response?.status} ${e.response?.data?.message}`
    );
  }
  throw e;
}
