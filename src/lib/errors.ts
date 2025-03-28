import { z, type ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends HttpError {
  constructor(public errors: Record<string, string[]>) {
    super("Validation failed", 400, { errors });
  }

  static fromZodError<Schema extends z.ZodTypeAny>(
    error: ZodError<Schema>
  ): ValidationError {
    const formattedErrors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
      const path = err.path.join(".");
      formattedErrors[path] = formattedErrors[path] || [];
      formattedErrors[path].push(err.message);
    });

    return new ValidationError(formattedErrors);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ForbiddenError extends HttpError {
  constructor(
    message = "Forbidden: You don't have permission to access this resource"
  ) {
    super(message, 403);
  }
}
