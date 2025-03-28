import { GET, POST } from "@/auth";
/**
 * @swagger
 * /api/auth/callback/credentials:
 *   post:
 *     summary: User Login with Credentials
 *     description: >
 *       Authenticates a user using credentials. This endpoint expects data in
 *       application/x-www-form-urlencoded format, including email, password, and a csrfToken.
 *       On successful authentication, the endpoint sets the authentication cookies (e.g. next-auth.session-token)
 *       and issues a 302 redirect to the callback URL (or default route, e.g. "/").
 *     tags:
 *       - Authentication
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: The user's email address.
 *         example: "user@example.com"
 *       - in: formData
 *         name: password
 *         required: true
 *         type: string
 *         description: The user's password.
 *         example: "password123"
 *       - in: formData
 *         name: csrfToken
 *         required: true
 *         type: string
 *         description: The CSRF token provided by the sign-in page.
 *         example: "the-generated-csrf-token"
 *     responses:
 *       302:
 *         description: >
 *           Successful authentication results in a redirect (HTTP 302) to the callback URL (or default route)
 *           and sets the authentication cookies.
 *       401:
 *         description: Invalid credentials.
 */

/**
 * @swagger
 * (Swagger documentation goes here)
 */
export { GET, POST };
