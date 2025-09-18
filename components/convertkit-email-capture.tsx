"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

interface ConvertKitEmailCaptureProps {
  formId: string
  title?: string
  subtitle?: string
  buttonText?: string
  successMessage?: string
  className?: string
}

export function ConvertKitEmailCapture({
  formId,
  title = "JOIN THE CREW",
  subtitle = "Weekly power-ups. No spam.",
  buttonText = "ACCESS NOW",
  successMessage = "TRANSMISSION RECEIVED!",
  className = ""
}: ConvertKitEmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { playSound } = useSound()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    playSound("click")

    try {
      // ConvertKit API endpoint for form submission
      const response = await fetch(`https://app.convertkit.com/forms/${formId}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY || "",
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail("")
        playSound("success")

        // Reset after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (err) {
      // Fallback to embedded form script method
      try {
        const script = document.createElement("script")
        script.src = `https://f.convertkit.com/ckjs/ck.5.js`
        script.async = true
        script.setAttribute("data-uid", formId)
        document.body.appendChild(script)

        // Submit via ConvertKit's embedded form method
        const formData = new FormData()
        formData.append("email_address", email)

        const response = await fetch(`https://app.convertkit.com/forms/${formId}/subscriptions`, {
          method: "POST",
          body: formData,
          mode: "no-cors" // ConvertKit doesn't support CORS for direct API calls
        })

        setIsSubmitted(true)
        setEmail("")
        playSound("success")

        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } catch (fallbackErr) {
        setError("Unable to subscribe. Please try again.")
        console.error("Subscription error:", fallbackErr)
        playSound("hover")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputFocus = () => {
    playSound("hover")
  }

  return (
    <div className={`convertkit-capture ${className}`}>
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 retro-text text-center">
          {title}
        </h3>
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="ENTER YOUR EMAIL"
              required
              disabled={isSubmitting}
              className="w-full bg-black border-2 border-cyan-400 text-cyan-400 p-4 uppercase rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-cyan-700 font-bold disabled:opacity-50"
              style={{ fontFamily: 'monospace', fontSize: '1rem' }}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full retro-button bg-yellow-400 text-black hover:bg-cyan-400 hover:text-black font-bold px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                {buttonText}
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="text-cyan-400 retro-text text-2xl font-bold blink">
            {successMessage}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Welcome aboard, Captain! Check your inbox.
          </p>
        </div>
      )}

      {subtitle && !isSubmitted && (
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>{subtitle}</p>
          <p>Unsubscribe anytime.</p>
        </div>
      )}

      {/* ConvertKit embedded form fallback */}
      <script async data-uid={formId} src="https://f.convertkit.com/ckjs/ck.5.js"></script>
    </div>
  )
}