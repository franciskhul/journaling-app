export const AUTH_CONFIG = {
  // Token Expiration (in seconds)
  TOKEN_EXPIRATION_TIME: 60 * 60 * 24, // 1 day (86,400 seconds)
  REFRESH_TOKEN_EXPIRATION_TIME: 60 * 60 * 24 * 7, // 7 days (604,800 seconds)

  // Cookie Settings
  COOKIE_NAMES: {
    SESSION_TOKEN: "next-auth.session-token",
    REFRESH_TOKEN: "next-auth.refresh-token",
    CSRF_TOKEN: "next-auth.csrf-token",
  },

  // Security Settings
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },

  // Default User Role
  DEFAULT_ROLE: "USER" as const,
} as const;
