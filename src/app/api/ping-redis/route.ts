/* eslint-disable @typescript-eslint/no-unused-vars */
// For Next.js API route
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await redis.ping();
    res.status(200).json({ message: "Redis pinged successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to ping Redis" });
  }
}
