import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessTokenSecret = crypto.randomBytes(32).toString("hex");
const refreshTokenSecret = crypto.randomBytes(32).toString("hex");

const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, "", { encoding: "utf8" });
}

const envContent = `ACCESS_TOKEN_SECRET=${accessTokenSecret}
REFRESH_TOKEN_SECRET=${refreshTokenSecret}
`;

fs.appendFileSync(envPath, envContent, { encoding: "utf8" });

console.log("✅ Secrets generated and added to .env");
