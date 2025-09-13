"use client"

import Image from "next/image"
import Link from "next/link"

export default function Unsubscribed() {
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
            src="/images/academy-logo-min.png"
            alt="AI CAPTAINS ACADEMY"
            width={500}
            height={250}
            className="object-contain"
            priority
          />
        </div>

        {/* Unsubscribed Status */}
        <div className="mb-8">
          <p className="text-cyan-400 retro-text text-xl md:text-2xl font-bold">
            You've been unsubscribed!
          </p>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
            We're sorry to see you go, Captain.
          </h1>
        </div>

        {/* Unsubscribe Description */}
        <div className="mb-8 max-w-4xl">
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
            Your email has been unsubscribed as you've requested.
          </p>
        </div>

        {/* Return to Site */}
        <div className="max-w-4xl">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            Changed your mind? You can always
            <br className="hidden sm:block" />
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-semibold underline decoration-cyan-400/50 hover:decoration-cyan-300"
            >
              return to AI Captains Academy
            </Link>
            {" "}and sign up again.
          </p>
        </div>
      </div>
    </div>
  )
}