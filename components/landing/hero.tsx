"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "./hero-preview";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* atmospheric gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% -10%, hsl(359 78% 52% / 0.08), transparent 70%)",
        }}
      />

      <div className="container pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Built for Indian CAs · WhatsApp-native
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tightest text-ink sm:text-5xl md:text-6xl"
          >
            Stop chasing clients
            <br className="hidden sm:block" /> for{" "}
            <span className="relative whitespace-nowrap text-primary">
              documents.
              <svg
                className="absolute -bottom-1 left-0 w-full text-accent/70"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 9C60 3 240 3 298 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            Lekha sends WhatsApp reminders, collects documents through a
            no-login link, and tracks every client&apos;s filing status on one
            clean board. The follow-ups run themselves.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="#pricing">
              <Button size="lg" className="group w-full sm:w-auto">
                Start your 14-day free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-5 flex items-center justify-center gap-5 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              No card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-primary" />
              Set up in one afternoon
            </span>
          </motion.div>
        </motion.div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-20"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
