import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db-users";
import { verifyPassword } from "@/lib/utils/passwordHashing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please sign up first." },
        { status: 404 },
      );
    }

    // Verify password
    const passwordValid = user.password
      ? await verifyPassword(password, user.password)
      : false;

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        {
          error:
            "Email not verified yet. Please check your email for the verification link.",
          requiresVerification: true,
        },
        { status: 403 },
      );
    }

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully!",
        user: {
          email: user.email,
          name: user.name,
          verified: user.verified,
          paymentCompleted: user.paymentCompleted,
        },
      },
      { status: 200 },
    );

    // Set a secure session cookie
    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
