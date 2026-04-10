import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db-users";

/**
 * Check if email already exists in database
 * GET /api/check-email?email=...
 * POST /api/check-email { email: "..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", exists: false },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    const exists = !!user;

    return NextResponse.json(
      {
        exists,
        email: email.toLowerCase(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", exists: false },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    const exists = !!user;

    return NextResponse.json(
      {
        exists,
        email: email.toLowerCase(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 },
    );
  }
}
