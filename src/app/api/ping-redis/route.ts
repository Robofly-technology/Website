import { Redis } from "@upstash/redis";
import { generateOTP } from "@/utils/otpUtils";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const triggeredByCron = !!request.headers.get("x-vercel-cron");
    const now = Date.now();

    // Ping Redis to keep the connection alive
    await redis.ping();

    // Write data to Redis to keep it active
    const otp = generateOTP();
    const otpKey = `keepalive:otp:${now}`;

    // Store a short-lived key to 'touch' the database
    await redis.setex(otpKey, 24 * 60 * 60, otp); // 24h TTL

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
