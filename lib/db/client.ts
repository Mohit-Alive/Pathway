import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Set WebSocket constructor for Neon serverless pool in Node.js runtime
neonConfig.webSocketConstructor = ws;

declare global {
  // Prevent multiple connection pools during Turbopack HMR in development
  var _neonPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

const pool = globalThis._neonPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  globalThis._neonPool = pool;
}

export const db = drizzle(pool, { schema });
