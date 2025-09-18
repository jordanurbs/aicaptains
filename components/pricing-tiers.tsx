"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"
import { 
  Check, 
  Zap, 
  Crown, 
  Anchor, 
  Compass, 
  Shield,
  Star,
  Trophy,
  Users,
  Calendar,
  MessageSquare,
  Target,
  Rocket,
  Award
} from "lucide-react"

interface PricingTiersProps {
  className?: string
}

interface PricingTier {
  id: string
  name: string
  price: string
  yearlyPrice?: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaUrl: string
  icon: React.ReactNode
  coinSlotText: string
  arcadeStyle: string
  maritimeIcon: React.ReactNode
}

export function PricingTiers({ className = "" }: PricingTiersProps) {
  const { playSound } = useSound()
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)

  const handleHover = () => {
    playSound("hover")
  }

  const handleButtonClick = () => {
    playSound("click")
    // Trigger celebration for pricing selection
    const event = new CustomEvent('celebrate', { detail: { type: 'purchase' } })
    window.dispatchEvent(event)
  }

  const handleCoinSlotClick = (tierId: string) => {
    playSound("select")
    setHoveredTier(tierId === hoveredTier ? null : tierId)
  }

  const pricingTiers: PricingTier[] = [
    {
      id: "academy",
      name: "ACADEMY ACCESS",
      price: "$150",
      period: "/yr",
      description: "Perfect for individual builders ready to transform their skills",
      features: [
        "Complete curriculum access",
        "Community access and peer support",
        "Weekly community Q&A sessions",
        "Micro-workshops library",
        "Foundation skill building",
        "Basic AI tools training"
      ],
      ctaText: "START FREE",
      ctaUrl: "https://skool.com/aicaptains",
      icon: <Users className="w-8 h-8" />,
      coinSlotText: "INSERT COIN",
      arcadeStyle: "bg-gradient-to-b from-blue-900 to-purple-900",
      maritimeIcon: <Compass className="w-6 h-6" />
    },
    {
      id: "captain",
      name: "CAPTAIN'S BUNDLE",
      price: "$597",
      period: "",
      description: "For builders serious about transformation",
      features: [
        "Everything in Academy Access",
        "LIFETIME ACCESS (not yearly)",
        "2x 1-on-1 breakthrough sessions",
        "Normally $350 each session",
        "Advanced AI implementation",
        "Priority community support",
        "Captain's exclusive content",
        "Direct mentor access"
      ],
      popular: true,
      ctaText: "JOIN NOW",
      ctaUrl: "https://skool.com/aicaptains",
      icon: <Crown className="w-8 h-8" />,
      coinSlotText: "POWER UP",
      arcadeStyle: "bg-gradient-to-b from-yellow-600 to-orange-600",
      maritimeIcon: <Anchor className="w-6 h-6" />
    },
    {
      id: "admiral",
      name: "ADMIRAL'S FLEET",
      price: "$8997",
      period: "",
      description: "The complete transformation package",
      features: [
        "Everything in Captain's Bundle",
        "6-month build-a-business incubator",
        "Direct mentor access with Jordan Urbs",
        "Personal coaching sessions",
        "Business strategy development",
        "Revenue optimization guidance",
        "GUARANTEE: Business built or we finish it!",
        "Admiral's inner circle access"
      ],
      ctaText: "GET ACCESS",
      ctaUrl: "https://skool.com/aicaptains",
      icon: <Trophy className="w-8 h-8" />,
      coinSlotText: "ULTIMATE",
      arcadeStyle: "bg-gradient-to-b from-purple-600 to-pink-600",
      maritimeIcon: <Shield className="w-6 h-6" />
    }
  ]

  return (
    <section id="pricing-section" className={`relative py-16 ${className}`}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>
      
      {/* Section header */}
      <div className="relative z-10 text-center mb-12">
        <div className="border-4 border-yellow-500 rounded-lg p-6 bg-gradient-to-b from-blue-900 to-purple-900 mb-8">
          <h2 className="retro-text text-4xl md:text-6xl text-cyan-400 mb-4">
            CHOOSE YOUR PATH
          </h2>
          <p className="text-gray-300 text-lg mb-4">
            Transform from passenger to AI Captain
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Rocket className="w-5 h-5" />
            <span className="text-sm">BUILD WITH AI, NOT LIMITS</span>
            <Rocket className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={`arcade-cabinet-frame ${tier.popular ? 'popular-tier' : ''}`}
            onMouseEnter={handleHover}
          >
            {/* Popular badge */}
            {tier.popular && (
              <div className="popular-badge">
                <Star className="w-4 h-4 mr-1" />
                MOST POPULAR
                <Star className="w-4 h-4 ml-1" />
              </div>
            )}

            {/* Arcade cabinet header */}
            <div className="arcade-header">
              <div className="coin-slot-area">
                <button
                  className="coin-slot"
                  onClick={() => handleCoinSlotClick(tier.id)}
                  onMouseEnter={handleHover}
                >
                  <div className="coin-slot-light blink"></div>
                  <span className="coin-slot-text">{tier.coinSlotText}</span>
                </button>
                <div className="arcade-controls">
                  <div className="control-stick"></div>
                  <div className="action-buttons">
                    <div className="action-button red"></div>
                    <div className="action-button yellow"></div>
                    <div className="action-button blue"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main screen */}
            <div className={`arcade-screen crt-screen ${tier.arcadeStyle}`}>
              {/* CRT effects */}
              <div className="crt-scanlines-fast"></div>
              <div className="crt-scanlines-static"></div>
              <div className="crt-phosphor-glow"></div>
              
              {/* Screen content */}
              <div className="screen-content">
                {/* Tier header */}
                <div className="tier-header">
                  <div className="tier-icon-container">
                    {tier.icon}
                    <div className="maritime-icon ocean-drift">
                      {tier.maritimeIcon}
                    </div>
                  </div>
                  <h3 className="tier-name retro-text">{tier.name}</h3>
                  <p className="tier-description">{tier.description}</p>
                </div>

                {/* Price display */}
                <div className="price-display">
                  <div className="price-main">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{tier.price.replace('$', '')}</span>
                    <span className="price-period">{tier.period}</span>
                  </div>
                  {tier.id === "captain" && (
                    <div className="lifetime-badge">
                      <Award className="w-4 h-4 mr-1" />
                      LIFETIME ACCESS
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="features-list">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <Check className="feature-check" />
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="cta-container">
                  <Button
                    className={`cta-button retro-button ${
                      tier.popular
                        ? 'bg-yellow-600 text-black hover:bg-yellow-400 border-yellow-400'
                        : 'bg-cyan-600 text-white hover:bg-cyan-400 hover:text-black border-cyan-400'
                    } font-bold px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base button-text border-4 captain-glow`}
                    onClick={handleButtonClick}
                    onMouseEnter={handleHover}
                    asChild
                  >
                    <a href={tier.ctaUrl} target="_blank" rel="noopener noreferrer">
                      {tier.ctaText} <Zap className="ml-2 h-5 w-5 blink" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Arcade cabinet base */}
            <div className="arcade-base">
              <div className="speaker-grille">
                <div className="speaker-holes"></div>
              </div>
              <div className="coin-return">
                <div className="coin-door"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Money-back guarantee */}
      <div className="relative z-10 text-center mt-12">
        <div className="border-2 border-green-500 rounded-lg p-6 bg-gradient-to-b from-green-900/20 to-blue-900/20 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-6 h-6 text-green-400" />
            <h3 className="retro-text text-xl text-green-400">CAPTAIN'S GUARANTEE</h3>
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-gray-300 text-sm">
            30-day money-back guarantee on all plans. If you don't see transformation in your first month, 
            we'll refund your journey and help you navigate to the right course.
          </p>
        </div>
      </div>
    </section>
  )
}