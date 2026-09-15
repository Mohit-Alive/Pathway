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

// Required: an idle pooled client can emit 'error' (a dropped socket,
// Neon compute autosuspend, etc) outside of any query. Pool is an
// EventEmitter, so an 'error' event with no listener throws and crashes
// the entire Node process - not just the one request using it. Queries
// still surface their own failure via the rejected promise; this only
// stops that from also taking down the server.
pool.on("error", (err: Error) => {
  console.error("Neon pool error (connection evicted, not fatal):", err.message);
});

if (process.env.NODE_ENV !== "production") {
  globalThis._neonPool = pool;
}

export const db = drizzle(pool, { schema });
