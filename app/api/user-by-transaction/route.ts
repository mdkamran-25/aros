import { NextRequest, NextResponse } from "next/server";
import { getUserByTransactionId } from "@/lib/db-users";

/**
 * Get user by transaction ID
 * Used by signup confirmation page to display user details and verification status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    const user = await getUserByTransactionId(transactionId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          email: user.email,
          name: user.name,
          verified: user.verified,
          verifiedAt: user.verifiedAt,
          paymentCompleted: user.paymentCompleted,
          transactionId: user.transactionId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user by transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
