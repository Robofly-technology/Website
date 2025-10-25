import { dbConnect } from "@/lib/dbConnect";
import Logg from "@/models/logs";

export async function GET(request: Request) {
  try {
    const triggeredByCron = !!request.headers.get("x-vercel-cron");

    // Connect to MongoDB
    await dbConnect();

    const now = Date.now();

    // Create a log entry to keep MongoDB active
    // Set expiration to 5 minutes from now
    const expiresAt = new Date(now + 5 * 60 * 1000); // 5 minutes in milliseconds

    const logEntry = await Logg.create({
      username: "automated",
      change: "Database pinged by the automatic job",
      expiresAt: expiresAt,
    });

    // Log the ping for monitoring purposes
    console.log("/api/ping-mongodb run", {
      triggeredByCron,
      ts: now,
      logId: logEntry._id,
    });

    return new Response(
      JSON.stringify({
        message: "MongoDB pinged successfully",
        triggeredByCron,
        lastRun: now,
        logId: logEntry._id,
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
