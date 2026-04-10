import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, markPaymentComplete } from "@/lib/db-users";

/**
 * Mark payment as completed for a user
 * Requires valid session cookie
 */
export async function POST(request: NextRequest) {
  try {
    // Get email from session cookie
    const sessionEmail = request.cookies.get("user_email")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    // Verify session email matches request email
    if (email && sessionEmail !== email) {
      return NextResponse.json(
        { error: "Session email does not match request email" },
        { status: 403 },
      );
    }

    // Get user
    const user = await getUserByEmail(sessionEmail);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        { error: "Email must be verified before payment" },
        { status: 400 },
      );
    }

    // Mark payment as complete
    await markPaymentComplete(sessionEmail);

    return NextResponse.json(
      {
        success: true,
        message: "Payment marked as complete",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment complete error:", error);
    return NextResponse.json(
      { error: "Failed to mark payment as complete" },
      { status: 500 },
    );
  }
}
