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

export type CategoryWithUserFlag = {
  id: string;
  name: string;
  systemGenerated: boolean;
  isUserCategory: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type JournalEntrySuccess = {
  id: string;
  title: string;
  content: string;
  userId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type JournalEntryValidationError = {
  error: string;
  details: Record<string, string[]>;
};

export type JournalEntryConflictError = {
  error: string;
  message: string;
  code: "409";
};

// Type Guards

export function isJournalEntryValidationError(
  response: unknown
): response is JournalEntryValidationError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    "details" in response
  );
}

export function isJournalEntryConflictError(
  response: unknown
): response is JournalEntryConflictError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    "code" in response &&
    response.code === "409"
  );
}

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
