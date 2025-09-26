"use client"

import Image from "next/image"
import Link from "next/link"

export default function SequenceUnsubscribed() {
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
            Successfully unsubscribed
          </p>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
            You've been unsubscribed from this sequence
          </h1>
        </div>

        {/* Unsubscribe Description */}
        <div className="mb-8 max-w-4xl">
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
            You won't receive any more emails from this particular series.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
            You'll still receive other important updates and communications from AI Captains Academy.
          </p>
        </div>

        {/* Return to Site */}
        <div className="max-w-4xl">
          <Link
            href="/"
            className="inline-block px-8 py-3 text-black bg-cyan-400 hover:bg-cyan-300 transition-colors duration-200 font-bold text-lg rounded-lg"
          >
            Return to AI Captains Academy
          </Link>
        </div>
      </div>
    </div>
  )
}