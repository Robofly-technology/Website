import { dbConnect } from "@/lib/dbConnect";
import Logg from "@/models/logs";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // 1. Check if the header exists and matches your secret
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // 2. If not, return an "Unauthorized" response
      return new Response("Unauthorized", { status: 401 });
    }
    // This is the correct header to check
    const userAgent = request.headers.get("user-agent");
    const triggeredByCron = userAgent === "vercel-cron/1.0";
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
