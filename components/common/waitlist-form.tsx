"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { fadeUp, stagger } from "@/lib/utils/animation";
import { getClientId } from "@/lib/utils/cookie-id";
import Captcha from "./captcha/captcha-verification";
import CaptchaV2Widget from "./captcha/google-captcha-v2";

export function WaitiListForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Frontend mobile validation
        if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
            setError("Mobile number must be exactly 10 digits");
            setLoading(false);
            return;
        }

        try {
            const recaptchaToken = await recaptchaRef.current?.executeAsync();
            if (!recaptchaToken) {
                setError("Please complete the CAPTCHA");
                setLoading(false);
                return;
            }
            recaptchaRef.current?.reset();

            const res = await fetch("/api/waitlist/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    clientId: getClientId(),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setSubmitted(true);
                setForm({ name: "", email: "", mobile: "" });
                setTimeout(() => setSubmitted(false), 3000);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section
            id="notify"
            className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24"
        >
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center gap-6 text-center"
            >
                <motion.h3
                    variants={fadeUp}
                    className="font-serif text-2xl md:text-4xl"
                >
                    Be first to know
                </motion.h3>
                <motion.p
                    variants={fadeUp}
                    className="text-muted-foreground max-w-xl leading-relaxed"
                >
                    Join the waitlist for early access to our first drop and private
                    previews.
                </motion.p>

                <motion.form
                    onSubmit={onSubmit}
                    variants={fadeUp}
                    className="flex w-full max-w-md flex-col gap-3"
                    aria-label="Waitlist signup form"
                >
                    <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm border-accent outline-none placeholder:text-muted-foreground/70 focus:border-accent"
                        disabled={loading}
                    />

                    <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-accent"
                        disabled={loading}
                    />

                    <input
                        name="mobile"
                        type="tel"
                        pattern="\d{10}"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="10-digit Mobile Number"
                        className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-accent"
                        disabled={loading}
                    />


                    <CaptchaV2Widget onVerifiedChange={setIsCaptchaVerified} />

                    <button
                        type="submit"
                        disabled={!isCaptchaVerified || loading}

                        className="w-full  btn-outline-brand rounded-full bg-accent px-5 py-2  text-sm font-medium text-accent-foreground transition-transform hover:translate-y-[-2px]"
                    >
                        {loading ? "Submitting..." : "Notify Me"}
                    </button>

                </motion.form>


                <AnimatePresence>
                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="text-sm text-foreground/80"
                            role="status"
                        >
                            Thanks — we’ll be in touch.
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="text-sm text-red-500"
                            role="alert"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>

        </section>
    );
}
