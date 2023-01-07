import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

if (!process.env.DATABASE_URL)
  throw new Error("Missing environment variable 'DATABASE_URL'");
if (!process.env.APP_SECRET)
  throw new Error("Missing environment variable 'APP_SECRET'");
if (!process.env.PORT) throw new Error("Missing environment variable 'PORT'");

const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  APP_SECRET: process.env.APP_SECRET,
  PORT: +process.env.PORT,
};

export { env };
