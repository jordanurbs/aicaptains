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

        {/* Bootcamp Begins */}
        <div className="mb-8">
          <p className="text-cyan-400 retro-text text-xl md:text-2xl font-bold">
            And your Bootcamp begins!
          </p>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
            Day 1 ("The AI Captain's Mindset")
            <br />
            is on its way to your inbox!
          </h1>
        </div>

        {/* Bootcamp Description */}
        <div className="mb-8 max-w-4xl">
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
            Over the next 5 days, you're going to be introduced to common uses of the command line and why it's essential to harness AI to its full power.
          </p>
        </div>

        {/* Content Commander Challenge Note */}
        <div className="max-w-4xl">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            Ready NOW to kick your command line skills into high gear?
            <br className="hidden sm:block" />
            The{" "}
            <Link
              href="https://ccc.ai-captains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-semibold underline decoration-cyan-400/50 hover:decoration-cyan-300"
            >
              Content Commander Challenge
            </Link>
            {" "}is ready for you.
          </p>
        </div>
      </div>
    </div>
  )
}