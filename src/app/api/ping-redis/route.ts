import { Redis } from "@upstash/redis";
import { generateOTP } from "@/utils/otpUtils";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
    const now = Date.now();

    // Ping Redis to keep the connection alive
    await redis.ping();

    // Write data to Redis to keep it active
    const otp = generateOTP();
    const otpKey = `keepalive:otp:${now}`;

    // Store a short-lived key to 'touch' the database
    await redis.setex(otpKey, 5 * 60, otp); // 5m TTL

    // Store metadata about the ping
    await redis.set("ping_redis:last_run", now, { ex: 30 * 24 * 60 * 60 }); // keep 30d
    await redis.set(
      "ping_redis:last_source",
      triggeredByCron ? "cron" : "manual-or-client",
      { ex: 30 * 24 * 60 * 60 }
    );

    // Helpful function log in Vercel
    console.log("/api/ping-redis run", { triggeredByCron, ts: now, otpKey });

    return new Response(
      JSON.stringify({
        message: "Redis pinged and data written successfully",
        triggeredByCron,
        lastRun: now,
        otpKey,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to ping Redis:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to ping Redis",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
