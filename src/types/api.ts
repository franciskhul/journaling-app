export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
};

export type ApiConflictError = {
  error: string;
  message: string;
  code: "409";
};

// Specific types for your registration endpoint
export type RegistrationSuccess = {
  user: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  };
  accessToken: string;
  refreshToken: string;
  expires: string;
};

export type RegistrationError = {
  error: string;
  details: Record<string, string[]>;
};

// Type guard functions
export function isRegistrationError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is RegistrationError {
  return (
    response &&
    typeof response.error === "string" &&
    response.details !== undefined
  );
}

export function isApiConflictError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is ApiConflictError {
  return response && typeof response.error === "string";
}
