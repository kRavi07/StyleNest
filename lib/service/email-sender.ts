import { render, pretty } from "@react-email/render";
import WelcomeEmailReact from "@/components/email/registration-verification";
// Example usage in your application
export async function registrationEmailHtml(
  userEmail: string,
  userName: string,
  otpCode: string,
  serviceName = "YourApp"
) {
  const emailHtml = await pretty(
    await render(
      WelcomeEmailReact({
        userName,
        otpCode,
        serviceName,
        verificationUrl: `https://yourapp.com/verify?email=${encodeURIComponent(userEmail)}&code=${otpCode}`,
      })
    )
  );

  // Send email using your preferred email service
  // Example with a generic email service:
  /*
  await emailService.send({
    to: userEmail,
    subject: `Welcome to ${serviceName}! Verify your email`,
    html: emailHtml,
  })
  */

  return emailHtml;
}
