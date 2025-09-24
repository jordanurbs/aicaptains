"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { X, ChevronRight, RotateCcw, Target, MessageSquare, Sparkles, AlertTriangle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useSound } from "@/components/sound-provider"
import { useCelebration } from "@/components/celebration-effects"
import { useIsMobile } from "@/hooks/use-mobile"
import { GoalCards } from "@/components/goal-cards"
import { ExcuseSelector } from "@/components/excuse-selector"
import { AIResponseDisplay } from "@/components/ai-response-display"
// import { BuildersDilemmaErrorBoundary, ApiErrorBoundary } from "@/components/error-boundary"
// import { BuildersDilemmaSkeleton, GoalCardsSkeleton, ErrorStateSkeleton } from "@/components/skeleton-loaders"
import { useGenerateResponse, validateGoal, validateExcuse, validateForm, type ValidationResult, type ApiError, ErrorType } from "@/lib/api-client"

interface Goal {
  id: string
  title: string
  icon: React.ReactNode
  color: "cyan" | "yellow" | "purple"
  category: "build" | "automate" | "create" | "business" | "startup" | "collaborate"
}

interface Position {
  x: number
  y: number
}

interface FlowState {
  currentStep: 1 | 2 | 3
  selectedGoal: Goal | null
  selectedExcuse: string
  isPresetExcuse: boolean
  apiResponse: string | null
  apiCTA: string | null
  isLoading: boolean
  error: string | null
  apiError: ApiError | null
  validationErrors: ValidationResult | null
  retryCount: number
  lastSuccessfulStep: 1 | 2 | 3 | null
}

interface InteractiveBuildersDolemmaProps {
  className?: string
}

export function InteractiveBuildersDolemma({ className = "" }: InteractiveBuildersDolemmaProps) {
  const [flowState, setFlowState] = useState<FlowState>({
    currentStep: 1,
    selectedGoal: null,
    selectedExcuse: "",
    isPresetExcuse: false,
    apiResponse: null,
    apiCTA: null,
    isLoading: false,
    error: null,
    apiError: null,
    validationErrors: null,
    retryCount: 0,
    lastSuccessfulStep: null
  })
  
  const [isInitializing, setIsInitializing] = useState(true)
  const [componentError, setComponentError] = useState<string | null>(null)
  
  const [dropZone, setDropZone] = useState<DOMRect | null>(null)
  const [isDropZoneActive, setIsDropZoneActive] = useState(false)
  const [stepTransition, setStepTransition] = useState<'entering' | 'exiting' | null>(null)
  const [customGoalText, setCustomGoalText] = useState("")
  const [customGoalValidation, setCustomGoalValidation] = useState<ValidationResult | null>(null)
  
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()
  const { celebrate, CelebrationComponent } = useCelebration()
  const isMobile = useIsMobile()
  const { 
    generateResponse, 
    retry,
    isLoading: apiLoading, 
    isRetrying: apiRetrying,
    error: apiError,
    apiError: apiErrorDetails,
    canRetry
  } = useGenerateResponse()
  
  // Helper function to create custom goal from text input
  const createCustomGoal = useCallback((text: string): Goal => {
    return {
      id: `custom-goal-${Date.now()}`,
      title: text.trim(),
      icon: <Target className="w-5 h-5" />,
      color: "cyan" as const,
      category: "build" as const
    }
  }, [])
  
  // Handle text input changes with validation
  const handleCustomGoalChange = useCallback((text: string) => {
    setCustomGoalText(text)
    
    // Validate the input
    const validation = validateGoal(text)
    setCustomGoalValidation(validation)
    
    // If text is valid and long enough, create custom goal
    if (validation.isValid && text.trim().length >= 5) {
      const customGoal = createCustomGoal(text)
      setFlowState(prev => ({
        ...prev,
        selectedGoal: customGoal
      }))
    } else if (flowState.selectedGoal?.id.startsWith('custom-goal-')) {
      // Clear selected goal if it was a custom goal and text is now invalid
      setFlowState(prev => ({
        ...prev,
        selectedGoal: null
      }))
    }
    
    playSound("hover")
  }, [createCustomGoal, flowState.selectedGoal, playSound])
  
  // Handle when a goal is dropped (clear custom text)
  const handleGoalDropped = useCallback((goal: Goal) => {
    setCustomGoalText("")
    setCustomGoalValidation(null)
    setFlowState(prev => ({
      ...prev,
      selectedGoal: goal
    }))
  }, [])
  
  // Initialize component and check environment
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Simulate initialization checks
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setIsInitializing(false)
        setFlowState(prev => ({ ...prev, lastSuccessfulStep: 1 }))
      } catch (error: any) {
        setComponentError('Failed to initialize Builder\'s Dilemma')
        setIsInitializing(false)
      }
    }
    
    initializeComponent()
  }, [])

  // Update drop zone bounds when component mounts
  useEffect(() => {
    if (dropZoneRef.current) {
      const bounds = dropZoneRef.current.getBoundingClientRect()
      setDropZone(bounds)
    }

    const handleResize = () => {
      if (dropZoneRef.current) {
        const bounds = dropZoneRef.current.getBoundingClientRect()
        setDropZone(bounds)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [flowState.currentStep])

  // Sync API loading state with local state and handle errors
  useEffect(() => {
    setFlowState(prev => ({
      ...prev,
      isLoading: apiLoading || apiRetrying,
      error: apiError,
      apiError: apiErrorDetails
    }))
  }, [apiLoading, apiRetrying, apiError, apiErrorDetails])
  
  // Clear errors when changing steps
  useEffect(() => {
    setFlowState(prev => ({
      ...prev,
      error: null,
      apiError: null,
      validationErrors: null
    }))
  }, [flowState.currentStep])

  const handleGoalDrop = useCallback((goal: Goal, position: Position) => {
    // Check if dropped in the drop zone
    if (dropZone && 
        position.x >= dropZone.left && 
        position.x <= dropZone.right &&
        position.y >= dropZone.top && 
        position.y <= dropZone.bottom) {
      
      playSound("select")
      celebrate("goal-selection")
      
      handleGoalDropped(goal)
      
      setIsDropZoneActive(false)
    }
  }, [dropZone, playSound, celebrate, handleGoalDropped])

  const handleNextStep = useCallback(() => {
    if (flowState.currentStep === 1 && flowState.selectedGoal) {
      const goalValidation = validateGoal(flowState.selectedGoal.title)
      if (!goalValidation.isValid) {
        setFlowState(prev => ({ ...prev, error: goalValidation.errors[0]?.message || "Invalid goal" }))
        return
      }

      setStepTransition('exiting')
      playSound("click")
      
      setTimeout(() => {
        setFlowState(prev => ({
          ...prev,
          currentStep: 2,
          error: null
        }))
        setStepTransition('entering')
        
        setTimeout(() => setStepTransition(null), 500)
      }, 300)
    }
  }, [flowState.currentStep, flowState.selectedGoal, playSound])

  const handleExcuseSelected = useCallback((excuse: string, isPreset: boolean) => {
    setFlowState(prev => ({
      ...prev,
      selectedExcuse: excuse,
      isPresetExcuse: isPreset,
      error: null
    }))
  }, [])

  const handleGenerateResponse = useCallback(async () => {
    if (!flowState.selectedGoal || !flowState.selectedExcuse) return

    const excuseValidation = validateExcuse(flowState.selectedExcuse)
    if (!excuseValidation.isValid) {
      setFlowState(prev => ({ ...prev, error: excuseValidation.errors[0]?.message || "Invalid excuse" }))
      return
    }

    setStepTransition('exiting')
    playSound("startup")
    
    setTimeout(async () => {
      setFlowState(prev => ({
        ...prev,
        currentStep: 3,
        error: null
      }))
      setStepTransition('entering')
      
      // Generate API response
      const result = await generateResponse({
        goal: flowState.selectedGoal!.title,
        excuse: flowState.selectedExcuse,
        isPresetExcuse: flowState.isPresetExcuse
      })

      if (result.success) {
        setFlowState(prev => ({
          ...prev,
          apiResponse: result.response || null,
          apiCTA: result.cta || null
        }))
        celebrate("achievement")
      }
      
      setTimeout(() => setStepTransition(null), 500)
    }, 300)
  }, [flowState.selectedGoal, flowState.selectedExcuse, flowState.isPresetExcuse, playSound, generateResponse, celebrate])

  const handleTryAnother = useCallback(() => {
    playSound("hover")
    setStepTransition('exiting')
    
    setTimeout(() => {
      setFlowState({
        currentStep: 1,
        selectedGoal: null,
        selectedExcuse: "",
        isPresetExcuse: false,
        apiResponse: null,
        apiCTA: null,
        isLoading: false,
        error: null,
        apiError: null,
        validationErrors: null,
        retryCount: 0,
        lastSuccessfulStep: null
      })
      setStepTransition('entering')
      
      setTimeout(() => setStepTransition(null), 500)
    }, 300)
  }, [playSound])

  const handleCTAClick = useCallback(() => {
    // This would typically navigate to a specific action or page
    playSound("startup")
    celebrate("achievement")
    console.log("CTA clicked:", flowState.apiCTA)
  }, [flowState.apiCTA, playSound, celebrate])

  const getStepProgress = () => {
    return (flowState.currentStep / 3) * 100
  }

  const canProceedToStep2 = flowState.selectedGoal !== null && !flowState.isLoading
  const canProceedToStep3 = flowState.selectedExcuse.length >= 10 && !flowState.isLoading
  
  // Loading check
  if (isInitializing) {
    return <div>Loading...</div>
  }
  
  // Component error state
  if (componentError) {
    return (
      <div // ErrorStateSkeleton 
        title="INITIALIZATION FAILED"
        description={componentError}
      />
    )
  }

  return (
    // <BuildersDilemmaErrorBoundary>
    <section className={`border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      <CelebrationComponent />
      
      {/* Header */}
      <div className="bg-yellow-500 text-black p-4 flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold retro-text retro-leading-tight">
          WHAT'S YOUR BUILDER'S DILEMMA?
        </h2>
        <div className="hidden md:block">
          <div className="w-8 h-8 bg-red-600 rounded border-2 border-black flex items-center justify-center">
            <X className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 border-b-2 border-yellow-500">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-mono text-sm font-bold">
              STEP {flowState.currentStep} OF 3
            </div>
            <div className="text-yellow-500 font-mono text-xs">
              {flowState.currentStep === 1 && "SELECT YOUR GOAL"}
              {flowState.currentStep === 2 && "IDENTIFY YOUR EXCUSE"}
              {flowState.currentStep === 3 && "AI CAPTAIN RESPONSE"}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-600">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-cyan-400/20"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`
                  flex items-center gap-2 text-xs font-mono
                  ${flowState.currentStep >= step ? 'text-cyan-400' : 'text-gray-500'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${flowState.currentStep > step 
                    ? 'border-green-400 bg-green-400/20 text-green-400' 
                    : flowState.currentStep === step 
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 animate-pulse' 
                    : 'border-gray-600 bg-gray-700/20 text-gray-500'
                  }
                `}>
                  {flowState.currentStep > step ? '✓' : step}
                </div>
                <span className="hidden sm:inline">
                  {step === 1 && 'GOAL'}
                  {step === 2 && 'EXCUSE'}
                  {step === 3 && 'SOLUTION'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 relative min-h-[600px]">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>
        
        {/* Scanline Effect */}
        <div className="scanline-thin"></div>

        {/* Step Content */}
        <div className={`
          relative z-10 transition-all duration-500
          ${stepTransition === 'exiting' ? 'opacity-0 transform translate-x-4' : ''}
          ${stepTransition === 'entering' ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}
        `}>
          {/* Step 1: Goal Selection */}
          {flowState.currentStep === 1 && (
            <div className="space-y-6">
              {/* Captain Jax Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="/images/jax-avatar.png"
                    alt="Captain Jax"
                    fill
                    className="object-cover rounded-full border-2 border-cyan-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <div className="text-cyan-400 font-mono text-2xl md:text-3xl lg:text-4xl font-bold retro-text">
                    ASK CAPTAIN JAX!
                  </div>
                </div>
              </div>

              {/* Header Row with "I WANT TO..." and Drop Zone */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
                {/* I WANT TO... Header */}
                <div className="lg:flex-shrink-0">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold retro-text text-cyan-400">
                    I WANT TO...
                  </h2>
                </div>

                {/* Drop Zone */}
                <div 
                  ref={dropZoneRef}
                  className={`
                    flex-1 border-4 border-dashed rounded-lg p-6 lg:p-8 text-center transition-all duration-200
                    ${flowState.selectedGoal 
                      ? 'border-green-400 bg-green-900/20' 
                      : isDropZoneActive 
                      ? 'border-cyan-400 bg-cyan-900/20' 
                      : 'border-gray-600 bg-gray-800/20'
                    }
                  `}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDropZoneActive(true)
                  }}
                  onDragLeave={() => setIsDropZoneActive(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDropZoneActive(false)
                    
                    // Get the dropped goal ID from the data transfer
                    const goalId = e.dataTransfer.getData("text/plain")
                    
                    // Find the goal from the predefined goals
                    const goals = [
                      { id: "ai-apps", title: "Build AI-powered apps that solve real problems", icon: null, color: "cyan" as const, category: "build" as const },
                      { id: "workflow-automation", title: "Automate my workflow with intelligent agents", icon: null, color: "yellow" as const, category: "automate" as const },
                      { id: "content-tools", title: "Create viral content tools for creators", icon: null, color: "purple" as const, category: "create" as const },
                      { id: "consultancy", title: "Launch my own AI consultancy business", icon: null, color: "cyan" as const, category: "business" as const },
                      { id: "unicorn-startup", title: "Build the next unicorn startup with AI", icon: null, color: "yellow" as const, category: "startup" as const },
                      { id: "ai-collaboration", title: "Enhance my dev workflow with AI collaboration", icon: null, color: "purple" as const, category: "collaborate" as const }
                    ]
                    
                    const goal = goals.find(g => g.id === goalId)
                    if (goal) {
                      playSound("select")
                      celebrate("goal-selection")
                      
                      setFlowState(prev => ({
                        ...prev,
                        selectedGoal: goal
                      }))
                    }
                  }}
                >
                  {flowState.selectedGoal ? (
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
                      <Target className="w-8 h-8 lg:w-10 lg:h-10 text-green-400 flex-shrink-0" />
                      <div className="text-center lg:text-left flex-1">
                        <h3 className="text-2xl lg:text-4xl font-bold text-green-400 retro-text">
                          {flowState.selectedGoal.title.toUpperCase()}
                        </h3>
                        <div className="text-green-400 font-mono text-xs lg:text-sm animate-pulse mt-2">
                          ✓ READY TO PROCEED
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFlowState(prev => ({ ...prev, selectedGoal: null }))
                          setCustomGoalText("")
                          setCustomGoalValidation(null)
                          playSound("hover")
                        }}
                        className="
                          flex items-center gap-2 px-3 py-2 rounded border-2
                          border-red-400 bg-red-900/20 text-red-400 font-mono text-sm
                          hover:bg-red-900/40 hover:border-red-300 hover:text-red-300
                          transition-all duration-200 flex-shrink-0
                        "
                        title="Clear selected goal"
                      >
                        <X className="w-4 h-4" />
                        CLEAR
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
                      <Target className={`w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 ${
                        isDropZoneActive ? 'text-cyan-400 animate-pulse' : 
                        customGoalText ? 'text-cyan-400' :
                        customGoalValidation?.errors.length ? 'text-red-400' :
                        'text-gray-500'
                      }`} />
                      <div className="flex-1 w-full lg:text-left">
                        <input
                          type="text"
                          value={customGoalText}
                          onChange={(e) => handleCustomGoalChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && customGoalValidation?.isValid) {
                              playSound("select")
                              celebrate("goal-selection")
                            }
                          }}
                          placeholder={isMobile ? "Type or tap & drop a goal here" : "Type or drag & drop a goal here"}
                          className={`
                            w-full bg-transparent border-none outline-none
                            text-2xl lg:text-4xl font-bold retro-text placeholder-gray-500
                            transition-all duration-200
                            ${isDropZoneActive ? 'text-cyan-400' : 
                              customGoalText ? 
                                customGoalValidation?.isValid ? 'text-cyan-300' : 'text-red-400'
                              : 'text-gray-400'
                            }
                          `}
                          style={{ 
                            caretColor: customGoalValidation?.isValid ? '#22d3ee' : '#ef4444'
                          }}
                        />
                        {/* Validation feedback */}
                        {customGoalText && customGoalValidation && (
                          <div className="mt-2 text-xs font-mono">
                            {customGoalValidation.isValid ? (
                              <div className="text-green-400 animate-pulse">
                                ✓ {customGoalText.length}/200 characters
                              </div>
                            ) : (
                              customGoalValidation.errors.map((error, index) => (
                                <div key={index} className="text-red-400">
                                  ⚠ {error.message}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                        {/* Instruction text when empty */}
                        {!customGoalText && !isDropZoneActive && (
                          <div className="mt-2 text-gray-500 font-mono text-xs lg:text-sm">
                            {isMobile ? "Type your goal or tap a card from below" : "Type your goal or drag a card from below"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Goal Cards */}
              <GoalCards 
                onGoalDrop={handleGoalDrop}
                dropZones={dropZone ? [{ id: 'main', bounds: dropZone, label: 'Goal Selection' }] : []}
              />

              {/* Next Button */}
              {canProceedToStep2 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleNextStep}
                    className="
                      flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg
                      border-4 border-cyan-400 bg-gradient-to-br from-blue-900/80 to-cyan-900/80
                      text-cyan-300 transition-all duration-200 retro-button font-mono
                      hover:bg-gradient-to-br hover:from-blue-800/90 hover:to-cyan-800/90
                      hover:shadow-lg hover:shadow-cyan-400/30 hover:transform hover:-translate-y-1
                    "
                  >
                    <span>NEXT: IDENTIFY EXCUSE</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Excuse Selection */}
          {flowState.currentStep === 2 && (
            <div className="space-y-6">
              {/* Captain Jax Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="/images/jax-avatar.png"
                    alt="Captain Jax"
                    fill
                    className="object-cover rounded-full border-2 border-cyan-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <div className="text-cyan-400 font-mono text-2xl md:text-3xl lg:text-4xl font-bold retro-text">
                    ASK CAPTAIN JAX!
                  </div>
                </div>
              </div>

              <ExcuseSelector
                onExcuseSelected={handleExcuseSelected}
                onContinue={handleGenerateResponse}
              />

            </div>
          )}

          {/* Step 3: AI Response */}
          {flowState.currentStep === 3 && (
            <div className="space-y-6">
              <AIResponseDisplay
                goal={flowState.selectedGoal?.title}
                excuse={flowState.selectedExcuse}
                response={flowState.apiResponse || undefined}
                cta={flowState.apiCTA || undefined}
                isLoading={flowState.isLoading}
                error={flowState.error || undefined}
                onGenerateAnother={handleTryAnother}
                onCTAClick={handleCTAClick}
              />
              
              {/* Try Another Button */}
              {!flowState.isLoading && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleTryAnother}
                    className="
                      flex items-center gap-2 px-6 py-3 rounded-lg font-bold
                      border-2 border-purple-500 bg-purple-900/20 text-purple-300
                      transition-all duration-200 font-mono text-sm
                      hover:bg-purple-900/40 hover:border-purple-400
                      hover:shadow-lg hover:shadow-purple-400/20
                    "
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>TRY ANOTHER GOAL</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {flowState.error && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-900/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                <X className="w-4 h-4" />
                <span>{flowState.error}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
    // </BuildersDilemmaErrorBoundary>
  )
}