/**
 * @swagger
 * /api/v1/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET() {
  return new Response("Hello World!", {
    status: 200,
  });
}
