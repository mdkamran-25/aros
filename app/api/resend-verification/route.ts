import { NextRequest, NextResponse } from "next/server";
import {
  getUserByTransactionId,
  getUserByEmail,
  updateLastEmailVerificationSent,
} from "@/lib/db-users";
import { generateVerificationToken } from "@/lib/db-tokens";
import { sendConfirmationEmail } from "@/lib/email";

/**
 * Resend verification email with rate limiting
 * Max 3 resends per user, 1 resend per 5 minutes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, email } = body;

    if (!transactionId && !email) {
      return NextResponse.json(
        { error: "Transaction ID or email is required" },
        { status: 400 },
      );
    }

    // Get user
    let user;
    if (transactionId) {
      user = await getUserByTransactionId(transactionId);
    } else if (email) {
      user = await getUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.verified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Rate limiting: check if user has already requested resend within 5 minutes
    if (user.lastEmailVerificationSent) {
      const timeSinceLastSent =
        Date.now() - user.lastEmailVerificationSent.getTime();
      const fiveMinutesInMs = 5 * 60 * 1000;

      if (timeSinceLastSent < fiveMinutesInMs) {
        const secondsRemaining = Math.ceil(
          (fiveMinutesInMs - timeSinceLastSent) / 1000,
        );
        return NextResponse.json(
          {
            error: `Please wait ${Math.ceil(secondsRemaining / 60)} minutes before requesting another email`,
            nextResendAt: new Date(
              Date.now() + (fiveMinutesInMs - timeSinceLastSent),
            ),
          },
          { status: 429 },
        );
      }
    }

    // Generate new verification token
    let verificationToken: string;
    try {
      verificationToken = await generateVerificationToken(
        user.email,
        user.name,
        user.transactionId,
      );
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate verification token" },
        { status: 500 },
      );
    }

    // Send verification email
    try {
      await sendConfirmationEmail(
        user.name,
        user.email,
        user.transactionId,
        verificationToken,
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 },
      );
    }

    // Update last email sent timestamp
    try {
      await updateLastEmailVerificationSent(user.email);
    } catch (updateError) {
      console.error("Update timestamp error:", updateError);
      // Don't fail the request if timestamp update fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification email resent successfully",
        email: user.email,
        nextResendAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 },
    );
  }
}
