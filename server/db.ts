import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool as PgPool } from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
dotenv.config();

// Configure based on environment
let pool: NeonPool | PgPool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (process.env.NODE_ENV === "production") {
  // Production: Use Neon serverless
  neonConfig.webSocketConstructor = ws;
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("No DATABASE_URL found for production environment.");
  }
  
  pool = new NeonPool({ connectionString });
  db = drizzleNeon({ client: pool, schema });
} else {
  // Development: Use standard PostgreSQL
  const connectionString = process.env.LOCAL_DATABASE_URL;
  
  if (!connectionString) {
    throw new Error(
      "No LOCAL_DATABASE_URL found for development environment. Check your .env file."
    );
  }
  
  pool = new PgPool({ connectionString });
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };
