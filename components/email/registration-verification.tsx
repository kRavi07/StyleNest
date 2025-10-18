import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface WelcomeEmailProps {
    userName?: string
    otpCode: string
    serviceName?: string
    verificationUrl?: string
}

export const WelcomeEmailReact = ({
    userName = "there",
    otpCode,
    serviceName = "Our Service",
    verificationUrl = "#",
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>
            Welcome to {serviceName}! Verify your email with code {otpCode}
        </Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header Section */}
                <Section style={header}>
                    <Heading style={h1}>Welcome to {serviceName}!</Heading>
                </Section>

                {/* Body Section */}
                <Section style={bodySection}>
                    <Container style={card}>
                        <Text style={greeting}>Hi {userName}! 👋</Text>

                        <Text style={description}>
                            We are excited to have you on board! Please verify your email address to get started and unlock all
                            features.
                        </Text>

                        {/* OTP Code Display */}
                        <Section style={otpContainer}>
                            <Text style={otpLabel}>Your verification code</Text>
                            <Text style={otpCodeStyle}>{otpCode}</Text>
                        </Section>

                        <Text style={expiry}>This code will expire in 10 minutes for your security.</Text>
                    </Container>
                </Section>

                {/* Call-to-Action Section */}
                <Section style={ctaSection}>
                    <Button style={button} href={verificationUrl}>
                        Verify My Email
                    </Button>

                    <Text style={linkText}>
                        Or copy and paste this link in your browser:
                        <br />
                        <Link href={verificationUrl} style={link}>
                            {verificationUrl}
                        </Link>
                    </Text>
                </Section>

                {/* Footer Section */}
                <Section style={footer}>
                    <Text style={footerText}>If you didn&apos;t create an account with {serviceName}, please ignore this email.</Text>

                    <Text style={disclaimer}>This is an automated message, please do not reply to this email.</Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

// Styles
const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
}

const container = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
}

const header = {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    textAlign: "center" as const,
    borderBottom: "1px solid #f5f5f5",
}

const h1 = {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0",
    color: "#212121",
    letterSpacing: "-0.5px",
}

const bodySection = {
    backgroundColor: "#f5f5f5",
    padding: "50px 30px",
    textAlign: "center" as const,
}

const card = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    margin: "0 auto",
    maxWidth: "400px",
}

const greeting = {
    fontSize: "18px",
    margin: "0 0 30px 0",
    color: "#212121",
    lineHeight: "1.5",
}

const description = {
    fontSize: "16px",
    margin: "0 0 30px 0",
    color: "#555555",
    lineHeight: "1.6",
}

const otpContainer = {
    backgroundColor: "#FBC02D",
    padding: "20px",
    borderRadius: "8px",
    margin: "30px 0",
    border: "2px dashed #F57F17",
}

const otpLabel = {
    fontSize: "14px",
    margin: "0 0 10px 0",
    color: "#212121",
    fontWeight: "500",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
}

const otpCodeStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#212121",
    letterSpacing: "8px",
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    margin: "0",
}

const expiry = {
    fontSize: "14px",
    margin: "20px 0 30px 0",
    color: "#666666",
    lineHeight: "1.5",
}

const ctaSection = {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    textAlign: "center" as const,
}

const button = {
    backgroundColor: "#FBC02D",
    color: "#212121",
    padding: "16px 32px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    display: "inline-block",
}

const linkText = {
    fontSize: "14px",
    margin: "20px 0 0 0",
    color: "#666666",
}

const link = {
    color: "#FBC02D",
    wordBreak: "break-all" as const,
    fontSize: "13px",
}

const footer = {
    backgroundColor: "#f5f5f5",
    padding: "30px",
    textAlign: "center" as const,
    borderTop: "1px solid #e0e0e0",
}

const footerText = {
    fontSize: "14px",
    margin: "0 0 10px 0",
    color: "#666666",
    lineHeight: "1.5",
}

const disclaimer = {
    fontSize: "12px",
    margin: "0",
    color: "#999999",
}

export default WelcomeEmailReact
