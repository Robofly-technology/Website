import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const triggeredByCron = !!request.headers.get("x-vercel-cron");

    // Connect to MongoDB
    await dbConnect();

    // Perform a simple ping operation using mongoose connection
    const adminDb = mongoose.connection.db;
    await adminDb?.admin().ping();

    const now = Date.now();

    // Log the ping for monitoring purposes
    console.log("/api/ping-mongodb run", { triggeredByCron, ts: now });

    return new Response(
      JSON.stringify({
        message: "MongoDB pinged successfully",
        triggeredByCron,
        lastRun: now,
        database: mongoose.connection.db?.databaseName,
        readyState: mongoose.connection.readyState, // 1 = connected
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to ping MongoDB:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to ping MongoDB",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
