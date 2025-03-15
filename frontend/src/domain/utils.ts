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

export function getChangedFields<T extends object>(
  original: T,
  updated: T
): Partial<T> {
  if (original === updated) return {};

  const changes: Partial<T> = {};

  const allKeys = new Set([
    ...Object.keys(original),
    ...Object.keys(updated),
  ]) as Set<keyof T>;

  for (const key of allKeys) {
    const originalVal = original[key];
    const updatedVal = updated[key];

    if (!deepEqual(originalVal, updatedVal)) {
      changes[key] = updatedVal;
    }
  }

  return changes;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual(a[key as keyof object], b[key as keyof object])
    );
  }

  return false;
}

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};