"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSoundEffects } from "@/hooks/use-sound-effects"

type SoundContextType = ReturnType<typeof useSoundEffects>

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundEffects = useSoundEffects()

  return <SoundContext.Provider value={soundEffects}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
