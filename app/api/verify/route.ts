import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/db-tokens";
import { verifyUserEmail } from "@/lib/db-users";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    const tokenData = await verifyToken(token);

    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Mark user as verified in database
    const user = await verifyUserEmail(tokenData.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully!",
        data: {
          email: tokenData.email,
          name: tokenData.name,
          transactionId: tokenData.transactionId,
        },
      },
      { status: 200 },
    );

    // Set session cookie
    response.cookies.set("user_email", tokenData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
