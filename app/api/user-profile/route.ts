import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db-users";

/**
 * Get user profile by email
 * Should only work if the requesting user's session email matches
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Security: Check if the requesting user's session matches the requested email
    const sessionEmail = request.cookies.get("user_email")?.value;

    if (!sessionEmail || sessionEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch user from database
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user profile (without password)
    return NextResponse.json(
      {
        user: {
          email: user.email,
          name: user.name,
          verified: user.verified,
          paymentCompleted: user.paymentCompleted,
          verifiedAt: user.verifiedAt,
          paidAt: user.paidAt,
          transactionId: user.transactionId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
