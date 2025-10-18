"use client"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
const GoogleCaptchaProviderClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_V3!}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "body",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    )
}

export default GoogleCaptchaProviderClient