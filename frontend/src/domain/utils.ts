export const validateEmailId = (id: string): boolean => {
  return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(id);
};

export function mapAndThrowError(e: unknown): never {
  // TODO: Add a logger here
  throw e;
}
