export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AuthError) {
    return error.message;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return `Network error: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
