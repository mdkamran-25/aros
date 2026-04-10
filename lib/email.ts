import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendConfirmationEmail(
  name: string,
  email: string,
  transactionId: string,
  verificationToken?: string,
) {
  const verificationLink = verificationToken
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify?token=${verificationToken}`
    : null;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to MR BEAST CHALLENGE! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            h2 { color: #1f2937; margin: 0 0 10px 0; }
            .transaction-id { background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Welcome to MR BEAST CHALLENGE!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              
              <p>Thank you for signing up for the <strong>MR BEAST CHALLENGE</strong>! Your entry has been confirmed and you're now ready to compete for amazing prizes.</p>
              
              ${
                verificationLink
                  ? `
              <div class="info-box" style="border-left-color: #f59e0b; background: #fef3c7;">
                <h2 style="color: #92400e;">✉️ Verify Your Email</h2>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" class="button" style="background: #f59e0b;">
                  Verify Email Address
                </a>
                <p style="font-size: 12px; color: #666;">This link expires in 24 hours.</p>
              </div>
              `
                  : ""
              }
              
              <div class="info-box">
                <h2>📋 Your Entry Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Entry Fee:</strong> $0.99</p>
                <p><strong>Transaction ID:</strong></p>
                <div class="transaction-id">${transactionId}</div>
              </div>

              <div class="info-box">
                <h2>🎯 What's Next?</h2>
                <ol>
                  <li>You will receive a confirmation email with competition details within 24 hours</li>
                  <li>Log in to your account to view your participant dashboard</li>
                  <li>Follow the official MR BEAST CHALLENGE social media channels for live updates</li>
                  <li>Prepare yourself and compete for life-changing rewards!</li>
                </ol>
              </div>

              <div class="info-box" style="border-left-color: #10b981;">
                <h2>✨ Competition Details</h2>
                <p><strong>Prize Pool:</strong> Millions in cash prizes</p>
                <p><strong>Participants:</strong> Thousands competing worldwide</p>
                <p><strong>Duration:</strong> Check your dashboard for specific dates</p>
              </div>

              <p>If you have any questions, please contact us at <strong>support@mrbestsachallenge.com</strong></p>
              
              <p>Good luck! 🚀</p>
              <p>The MR BEAST CHALLENGE Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; 2026 MR BEAST CHALLENGE. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send confirmation email");
  }
}
