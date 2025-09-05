import { defineConfig } from "drizzle-kit";

// Use LOCAL_DATABASE_URL for development, DATABASE_URL for production
const databaseUrl = process.env.NODE_ENV === "production" 
  ? process.env.DATABASE_URL 
  : process.env.LOCAL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    process.env.NODE_ENV === "production" 
      ? "DATABASE_URL not found for production environment"
      : "LOCAL_DATABASE_URL not found for development environment. Check your .env file."
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
