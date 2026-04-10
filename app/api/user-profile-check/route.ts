import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db-users";

/**
 * Check if user has valid session and return their profile
 * Uses the httpOnly session cookie set by server
 */
export async function GET(request: NextRequest) {
  try {
    // Get email from session cookie
    const sessionEmail = request.cookies.get("user_email")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // Fetch user from database
    const user = await getUserByEmail(sessionEmail);

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
    console.error("Check user session error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 },
    );
  }
}
