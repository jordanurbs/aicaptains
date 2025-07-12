"use client"

import Image from "next/image"
import Link from "next/link"

export default function EmailConfirmed() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ILOVETHISBACKGROUND-min.png')"
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Scanline effect */}
      <div className="scanline"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* AI CAPTAINS Logo Image */}
        <div className="mb-8">
          <Image
            src="/images/aiclogo.png"
            alt="AI CAPTAINS"
            width={500}
            height={250}
            className="object-contain"
            priority
          />
        </div>

        {/* Time to build! */}
        <div className="mb-8">
          <p className="text-white text-xl md:text-2xl font-medium">
            Time to build!
          </p>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-cyan-400 retro-text text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
            YOU'VE MADE A POWERFUL DECISION.
          </h1>
        </div>

        {/* Confirmation Message */}
        <div className="mb-8 max-w-3xl space-y-4">
          <p className="text-gray-200 text-xl md:text-2xl">
            I've sent a confirmation email to your inbox.
          </p>
          <p className="text-gray-200 text-xl md:text-2xl">
            Please check and click the link to confirm your email.
          </p>
        </div>

        {/* Content Commander Challenge Note */}
        <div className="max-w-4xl">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            (BTW if you're ready NOW to kick your vibe coding into high gear,
            <br className="hidden sm:block" />
            the{" "}
            <Link
              href="https://ccc.ai-captains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200 font-semibold underline decoration-orange-400/50 hover:decoration-orange-300"
            >
              Content Commander Challenge
            </Link>
            {" "}is waiting for you.)
          </p>
        </div>
      </div>
    </div>
  )
}