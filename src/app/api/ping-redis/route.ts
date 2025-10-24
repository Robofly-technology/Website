/* eslint-disable @typescript-eslint/no-unused-vars */
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const triggeredByCron = !!request.headers.get("x-vercel-cron");

    await redis.ping();

    const now = Date.now();
    await redis.set("ping_redis:last_run", now, { ex: 30 * 24 * 60 * 60 }); // keep 30d
    await redis.set(
      "ping_redis:last_source",
      triggeredByCron ? "cron" : "manual-or-client",
      { ex: 30 * 24 * 60 * 60 }
    );

    // Helpful function log in Vercel
    console.log("/api/ping-redis run", { triggeredByCron, ts: now });
    return new Response(
      JSON.stringify({
        message: "Redis pinged successfully",
        triggeredByCron,
        lastRun: now,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to ping Redis" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
