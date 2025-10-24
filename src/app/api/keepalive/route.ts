import { Redis } from "@upstash/redis";
import { generateOTP } from "@/utils/otpUtils";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// This endpoint writes a tiny key to Redis at most once every 24 hours
export async function GET() {
  try {
    const now = Date.now();
    const lastRunKey = "keepalive:last_run";
    const lastRun = await redis.get<number>(lastRunKey);

    const TWENTY_THREE_HOURS = 23 * 60 * 60 * 1000; // be a bit lenient

    if (!lastRun || now - lastRun > TWENTY_THREE_HOURS) {
      const otp = generateOTP();
      const otpKey = `keepalive:otp:${now}`;

      // Store a short-lived key to 'touch' the database
      // 24h TTL is enough to keep the DB warm but avoids clutter
      await redis.setex(otpKey, 24 * 60 * 60, otp);

      // Record last run with a TTL of 7 days to avoid stale data hanging around
      await redis.set(lastRunKey, now, { ex: 7 * 24 * 60 * 60 });

      return new Response(
        JSON.stringify({ status: "ok", action: "wrote", otpKey }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: "ok", action: "skipped", lastRun }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
