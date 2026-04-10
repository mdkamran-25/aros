import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;

    // Validate input
    if (!name || !email || !amount) {
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

    // For now, return a success response
    // In production, integrate with PayPal API
    return NextResponse.json(
      {
        success: true,
        message: "Payment processing initiated",
        transactionId: `MRBEAST-${Date.now()}`,
        data: { name, email, amount },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
