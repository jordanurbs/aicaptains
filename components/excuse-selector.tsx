"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Brain, Zap, Terminal, Code, DollarSign, Bot, AlertTriangle } from "lucide-react"
import { useSound } from "@/components/sound-provider"
import { validateExcuse, type ValidationResult } from "@/lib/api-client"

interface ExcuseState {
  selectedPreset: string | null
  customText: string
  isValid: boolean
  validation: ValidationResult | null
}

interface ExcuseSelectorProps {
  className?: string
  onExcuseSelected?: (excuse: string, isPreset: boolean) => void
  onContinue?: (excuse: string, isPreset: boolean) => void
}

interface ExcuseFormData {
  customText: string
}

interface PresetExcuse {
  id: string
  text: string
  icon: React.ReactNode
  color: "cyan" | "yellow" | "purple"
  category: "knowledge" | "technical" | "overwhelm" | "understanding" | "cost" | "ai"
}

const presetExcuses: PresetExcuse[] = [
  {
    id: "dont-know-start",
    text: "I don't know where to start",
    icon: <Brain className="w-5 h-5" />,
    color: "cyan",
    category: "knowledge"
  },
  {
    id: "too-many-options",
    text: "There are too many options out there",
    icon: <Zap className="w-5 h-5" />,
    color: "yellow",
    category: "overwhelm"
  },
  {
    id: "never-used-cli",
    text: "I've never used the command line",
    icon: <Terminal className="w-5 h-5" />,
    color: "purple",
    category: "technical"
  },
  {
    id: "no-idea-under-hood",
    text: "I have no idea what's going on under the hood",
    icon: <Code className="w-5 h-5" />,
    color: "cyan",
    category: "understanding"
  },
  {
    id: "subscription-costs",
    text: "My subscription costs are adding up",
    icon: <DollarSign className="w-5 h-5" />,
    color: "yellow",
    category: "cost"
  },
  {
    id: "leverage-ai-effectively",
    text: "I don't know how to leverage AI effectively",
    icon: <Bot className="w-5 h-5" />,
    color: "purple",
    category: "ai"
  }
]

export function ExcuseSelector({ className = "", onExcuseSelected, onContinue }: ExcuseSelectorProps) {
  const [excuseState, setExcuseState] = useState<ExcuseState>({
    selectedPreset: null,
    customText: "",
    isValid: false,
    validation: null
  })
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null)
  const [clickedPreset, setClickedPreset] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [isCustomFocused, setIsCustomFocused] = useState(false)
  const { playSound } = useSound()

  const { register, watch, setValue, formState: { errors } } = useForm<ExcuseFormData>({
    defaultValues: {
      customText: ""
    }
  })

  const customText = watch("customText")

  // Update character count and validation
  useEffect(() => {
    const textLength = customText?.length || 0
    setCharCount(textLength)
    
    const hasPreset = !!excuseState.selectedPreset
    let validation: ValidationResult | null = null
    let isValid = false
    
    if (hasPreset) {
      // Preset is selected, no need to validate custom text
      isValid = true
    } else if (customText && customText.trim().length > 0) {
      // Validate custom text
      validation = validateExcuse(customText)
      isValid = validation.isValid
    }
    
    setExcuseState(prev => ({
      ...prev,
      customText: customText || "",
      isValid,
      validation
    }))
  }, [customText, excuseState.selectedPreset])

  const getColorClasses = (color: PresetExcuse["color"], isHovered: boolean, isSelected: boolean) => {
    const baseClasses = {
      cyan: {
        border: isSelected ? "border-cyan-400" : isHovered ? "border-cyan-500" : "border-cyan-600",
        bg: isSelected ? "bg-gradient-to-br from-blue-900/90 to-cyan-900/90" : isHovered ? "bg-gradient-to-br from-blue-900/60 to-cyan-900/60" : "bg-gray-800/90",
        text: isSelected || isHovered ? "text-cyan-300" : "text-gray-300",
        icon: isSelected || isHovered ? "text-cyan-400" : "text-cyan-500",
        glow: "shadow-cyan-400/30"
      },
      yellow: {
        border: isSelected ? "border-yellow-400" : isHovered ? "border-yellow-500" : "border-yellow-600",
        bg: isSelected ? "bg-gradient-to-br from-orange-900/90 to-yellow-900/90" : isHovered ? "bg-gradient-to-br from-orange-900/60 to-yellow-900/60" : "bg-gray-800/90",
        text: isSelected || isHovered ? "text-yellow-300" : "text-gray-300",
        icon: isSelected || isHovered ? "text-yellow-400" : "text-yellow-500",
        glow: "shadow-yellow-400/30"
      },
      purple: {
        border: isSelected ? "border-purple-400" : isHovered ? "border-purple-500" : "border-purple-600",
        bg: isSelected ? "bg-gradient-to-br from-purple-900/90 to-pink-900/90" : isHovered ? "bg-gradient-to-br from-purple-900/60 to-pink-900/60" : "bg-gray-800/90",
        text: isSelected || isHovered ? "text-purple-300" : "text-gray-300",
        icon: isSelected || isHovered ? "text-purple-400" : "text-purple-500",
        glow: "shadow-purple-400/30"
      }
    }
    return baseClasses[color]
  }

  const handlePresetClick = useCallback((excuse: PresetExcuse) => {
    setClickedPreset(excuse.id)
    playSound("click")
    
    // Clear custom text when selecting preset
    setValue("customText", "")
    
    setExcuseState(prev => ({
      ...prev,
      selectedPreset: prev.selectedPreset === excuse.id ? null : excuse.id,
      customText: ""
    }))
    
    if (onExcuseSelected) {
      onExcuseSelected(excuse.text, true)
    }
    
    // Add celebration effect
    if (Math.random() > 0.7) {
      const event = new CustomEvent('celebrate', { detail: { type: 'excuse-selection' } })
      window.dispatchEvent(event)
    }
    
    // Reset clicked state after animation
    setTimeout(() => setClickedPreset(null), 200)
  }, [playSound, setValue, onExcuseSelected])

  const handlePresetHover = useCallback((excuseId: string) => {
    setHoveredPreset(excuseId)
    playSound("hover")
  }, [playSound])

  const handleCustomTextChange = useCallback((value: string) => {
    // Clear preset selection when typing custom text
    if (value.length > 0 && excuseState.selectedPreset) {
      setExcuseState(prev => ({
        ...prev,
        selectedPreset: null
      }))
    }
    
    if (onExcuseSelected && value.length >= 10) {
      onExcuseSelected(value, false)
    }
  }, [excuseState.selectedPreset, onExcuseSelected])

  const handleContinue = useCallback(() => {
    if (!excuseState.isValid) return
    
    playSound("select")
    
    const excuse = excuseState.selectedPreset 
      ? presetExcuses.find(p => p.id === excuseState.selectedPreset)?.text || ""
      : excuseState.customText
    
    const isPreset = !!excuseState.selectedPreset
    
    if (onContinue) {
      onContinue(excuse, isPreset)
    }
  }, [excuseState, playSound, onContinue])

  const getCharCountColor = () => {
    if (charCount < 10) return "text-red-400"
    if (charCount > 250) return "text-yellow-400"
    if (charCount > 300) return "text-red-400"
    return "text-green-400"
  }

  return (
    <section className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold retro-text text-cyan-400 mb-2">
          WHAT'S HOLDING YOU BACK?
        </h2>
        <p className="text-gray-400 font-mono text-sm">
          SELECT YOUR BIGGEST OBSTACLE OR WRITE YOUR OWN
        </p>
      </div>

      {/* Preset Excuse Buttons */}
      <div className="mb-8">
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presetExcuses.map((excuse, index) => {
            const isHovered = hoveredPreset === excuse.id
            const isClicked = clickedPreset === excuse.id
            const isSelected = excuseState.selectedPreset === excuse.id
            const colors = getColorClasses(excuse.color, isHovered, isSelected)
            
            return (
              <button
                key={excuse.id}
                type="button"
                className={`
                  relative group cursor-pointer select-none text-left
                  border-4 rounded-lg p-4 
                  transition-all duration-200 ease-out
                  retro-button overflow-hidden
                  min-h-[120px] flex flex-col
                  ${colors.border} ${colors.bg}
                  ${isHovered || isSelected ? `transform -translate-y-1 shadow-lg ${colors.glow}` : 'hover:border-gray-600'}
                  ${isClicked ? 'transform translate-x-1 translate-y-1 shadow-none' : ''}
                  ${isSelected ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''}
                `}
                onClick={() => handlePresetClick(excuse)}
                onMouseEnter={() => handlePresetHover(excuse.id)}
                onMouseLeave={() => setHoveredPreset(null)}
              >
                {/* Background Grid Effect */}
                <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
                
                {/* Scanline Effect */}
                <div className="scanline-thin"></div>

                {/* Glitch overlay on hover/select */}
                {(isHovered || isSelected) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-400/5 to-transparent animate-pulse pointer-events-none" style={{animationDelay: '0.1s'}} />
                  </>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center
                      transition-all duration-200 transform
                      ${isHovered || isSelected
                        ? `${colors.border} bg-${excuse.color}-400/20 scale-110` 
                        : `border-gray-600 bg-gray-700/20 scale-100`
                      }
                    `}>
                      <div className={`transition-all duration-200 ${colors.icon}`}>
                        {excuse.icon}
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className={`
                      px-2 py-1 rounded text-xs font-mono uppercase tracking-wider
                      transition-all duration-200
                      ${isHovered || isSelected 
                        ? `bg-${excuse.color}-400/20 text-${excuse.color}-300 border border-${excuse.color}-400/50`
                        : 'bg-gray-700/50 text-gray-500 border border-gray-600/50'
                      }
                    `}>
                      {excuse.category}
                    </div>
                  </div>

                  {/* Excuse Text */}
                  <div className="flex-1 flex items-center">
                    <p className={`
                      text-sm leading-relaxed font-medium
                      transition-all duration-200
                      ${colors.text}
                      ${isHovered || isSelected ? 'transform scale-105' : ''}
                    `}>
                      "{excuse.text}"
                    </p>
                  </div>

                  {/* Status Indicator */}
                  {(isHovered || isSelected) && (
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-yellow-500 text-xs font-bold retro-text blink">
                        [{String(index + 1).padStart(2, '0')}]
                      </div>
                      <div className={`text-xs font-bold retro-text animate-pulse ${colors.icon}`}>
                        {isSelected ? '&gt; SELECTED' : '&gt; CLICK TO SELECT'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Glitch Effect Border */}
                {(isHovered || isSelected) && (
                  <>
                    <div className={`absolute inset-0 border-2 ${colors.border} rounded-lg animate-pulse pointer-events-none`}></div>
                    <div className="absolute -inset-1 border border-yellow-500 rounded-lg opacity-50 pointer-events-none" style={{animationDelay: '0.2s'}}></div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Input Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-purple-400 retro-text mb-4">
          OR TELL US YOUR SPECIFIC CHALLENGE
        </h3>
        
        <div className="relative">
          <div className={`
            relative border-4 rounded-lg overflow-hidden
            transition-all duration-200
            ${isCustomFocused || customText 
              ? 'border-purple-400 bg-gradient-to-br from-purple-900/30 to-pink-900/30' 
              : 'border-gray-600 bg-gray-800/50'
            }
            ${isCustomFocused ? 'shadow-lg shadow-purple-400/20' : ''}
          `}>
            {/* Background Grid Effect */}
            <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
            
            {/* Scanline Effect */}
            {isCustomFocused && <div className="scanline-thin"></div>}

            {/* Terminal-style input */}
            <div className="relative z-10 p-4">
              <div className="flex items-start gap-2 text-green-400 font-mono text-sm mb-2">
                <span className="blink">&gt;</span>
                <span>What's really holding you back?</span>
              </div>
              
              <textarea
                {...register("customText", {
                  minLength: {
                    value: 10,
                    message: "Please provide at least 10 characters"
                  },
                  maxLength: {
                    value: 300,
                    message: "Please keep it under 300 characters"
                  },
                  onChange: (e) => handleCustomTextChange(e.target.value)
                })}
                className={`
                  w-full bg-transparent text-white font-mono text-sm
                  border-none outline-none resize-none
                  placeholder:text-gray-500
                  min-h-[100px]
                  ${isCustomFocused ? 'text-purple-300' : 'text-gray-300'}
                `}
                placeholder="Type your specific challenge here... Be honest about what's really stopping you from achieving your AI goals."
                onFocus={() => {
                  setIsCustomFocused(true)
                  playSound("hover")
                }}
                onBlur={() => setIsCustomFocused(false)}
              />
              
              {/* Character Counter */}
              <div className="flex justify-between items-center mt-2 text-xs font-mono">
                <div className={`${getCharCountColor()}`}>
                  Characters: {charCount}/300
                  {charCount < 10 && (
                    <span className="text-red-400 ml-2 blink">
                      (min 10 required)
                    </span>
                  )}
                </div>
                
                {charCount >= 10 && charCount <= 300 && (
                  <div className="text-green-400 animate-pulse">
                    ✓ VALID INPUT
                  </div>
                )}
              </div>
              
              {/* Enhanced Error and Validation Messages */}
              {errors.customText && (
                <div className="text-red-400 text-xs font-mono mt-1 blink">
                  ERROR: {errors.customText.message}
                </div>
              )}
              
              {/* Validation Errors */}
              {excuseState.validation?.errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 text-red-400 text-xs font-mono mt-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{error.message}</span>
                </div>
              ))}
              
              {/* Validation Warnings */}
              {excuseState.validation?.warnings.map((warning, index) => (
                <div key={index} className="text-yellow-400 text-xs font-mono mt-1">
                  💡 {warning}
                </div>
              ))}
            </div>

            {/* Glitch overlay when focused */}
            {isCustomFocused && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-400/5 to-transparent animate-pulse pointer-events-none" style={{animationDelay: '0.1s'}} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!excuseState.isValid}
          className={`
            px-8 py-4 rounded-lg font-bold text-lg retro-button
            transition-all duration-200 font-mono
            ${excuseState.isValid
              ? 'border-4 border-yellow-400 bg-gradient-to-br from-yellow-900/80 to-orange-900/80 text-yellow-300 hover:bg-gradient-to-br hover:from-yellow-800/90 hover:to-orange-800/90 hover:shadow-lg hover:shadow-yellow-400/30 hover:transform hover:-translate-y-1'
              : 'border-4 border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {excuseState.isValid ? (
            <>
              <span className="blink">▶</span> CONTINUE TO SOLUTION
            </>
          ) : (
            "SELECT OR WRITE YOUR EXCUSE"
          )}
        </button>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-6 border-t-2 border-yellow-500 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="text-cyan-400 font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            PRESET OPTIONS: {presetExcuses.length}
          </div>
          <div className="text-yellow-500 font-mono blink">
            STATUS: {excuseState.isValid ? 'READY TO CONTINUE' : 'AWAITING INPUT'}
          </div>
        </div>
        <div className="mt-2 text-gray-400 font-mono text-xs">
          SELECT PRESET OR WRITE CUSTOM • HONESTY RECOMMENDED
        </div>
      </div>
    </section>
  )
}