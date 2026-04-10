import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/db-tokens";
import { registerUser, getUserByEmail } from "@/lib/db-users";
import { validatePassword } from "@/lib/utils/passwordValidator";
import { hashPassword } from "@/lib/utils/passwordHashing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, amount, password, confirmPassword } = body;

    // Validate input
    if (!name || !email || !amount || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Validate amount is $0.99
    if (parseFloat(amount) !== 0.99) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "Invalid password", details: passwordValidation.errors },
        { status: 400 },
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered. Please log in instead." },
        { status: 409 },
      );
    }

    // Generate transaction ID
    const transactionId = `MRBEAST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { error: "Failed to process password. Please try again." },
        { status: 500 },
      );
    }

    // Register user in database
    try {
      await registerUser(email, name, transactionId, hashedPassword);
    } catch (registerError: any) {
      console.error("Registration error:", registerError);
      return NextResponse.json(
        { error: "Failed to register user. Please try again." },
        { status: 500 },
      );
    }

    // Generate verification token
    let verificationToken: string;
    try {
      verificationToken = await generateVerificationToken(
        email,
        name,
        transactionId,
      );
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate verification token. Please try again." },
        { status: 500 },
      );
    }

    // Send confirmation email with verification link
    try {
      await sendConfirmationEmail(
        name,
        email,
        transactionId,
        verificationToken,
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Return error so user knows email failed
      return NextResponse.json(
        {
          error:
            "Failed to send verification email. Please check your email settings or try again later.",
          transactionId, // Still return transaction ID for reference
        },
        { status: 500 },
      );
    }

    // Store signup data (can be expanded to use a database)
    console.log("New signup:", {
      name,
      email,
      transactionId,
      verified: false,
      timestamp: new Date(),
    });

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Successfully registered for MR BEAST CHALLENGE!",
        transactionId,
        data: { name, email, amount },
        nextStep: "/signup/confirm", // Redirect to confirmation page
      },
      { status: 200 },
    );

    // Set session cookie so user can proceed to payment
    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
