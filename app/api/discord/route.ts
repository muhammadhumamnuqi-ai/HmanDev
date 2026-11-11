import { NextResponse } from "next/server";

const LANYARD_BASE = "https://api.lanyard.rest/v1/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const response = await fetch(`${LANYARD_BASE}/${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Discord presence" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Discord presence unavailable" },
      { status: 500 }
    );
  }
}
