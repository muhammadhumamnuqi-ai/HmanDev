import { NextResponse } from "next/server";

const TTL = 60 * 60 * 24 * 30; // 30 hari

export async function POST(request: Request) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 500 }
    );
  }

  let visitorId: string | null = null;
  try {
    const body = await request.json();
    visitorId = typeof body?.visitorId === "string" ? body.visitorId : null;
  } catch {
    visitorId = null;
  }

  if (!visitorId || visitorId.length > 64) {
    return NextResponse.json({ error: "Invalid visitorId" }, { status: 400 });
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const markRes = await fetch(
      `${url}/set/visitor:${encodeURIComponent(visitorId)}/1/ex/${TTL}/nx`,
      { headers }
    );
    const markData = await markRes.json();

    if (markData.result === "OK") {
      const incrRes = await fetch(`${url}/incr/visitors:unique`, { headers });
      const incrData = await incrRes.json();
      return NextResponse.json({ count: incrData.result, isNew: true });
    }

    const getRes = await fetch(`${url}/get/visitors:unique`, { headers });
    const getData = await getRes.json();
    return NextResponse.json({ count: Number(getData.result), isNew: false });
  } catch {
    return NextResponse.json(
      { error: "Counter unavailable" },
      { status: 500 }
    );
  }
}
