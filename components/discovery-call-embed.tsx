"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

export function DiscoveryCallEmbed() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      (function (C, A, L) { 
        let p = function (a, ar) { a.q.push(ar); }; 
        let d = C.document; 
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; 
          let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if(typeof namespace === "string"){
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
          } 
          p(cal, ar); 
        }; 
      })(window, "https://book.jordanurbs.com/embed/embed.js", "init");
      
      Cal("init", "ai-implementation-strategy-call", {origin:"https://book.jordanurbs.com"});

      Cal.ns["ai-implementation-strategy-call"]("inline", {
        elementOrSelector:"#my-cal-inline",
        config: {"layout":"month_view"},
        calLink: "me/ai-implementation-strategy-call",
      });

      Cal.ns["ai-implementation-strategy-call"]("ui", {
        "cssVarsPerTheme":{
          "light":{"cal-brand":"#002560"},
          "dark":{"cal-brand":"#73cbec"}
        },
        "hideEventTypeDetails":false,
        "layout":"month_view"
      });
    `
    
    document.head.appendChild(script)
    
    // Set loaded after a brief delay to allow the script to initialize
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
      // Clean up script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-yellow-500 text-black p-2 flex justify-between items-center">
        <h2 className="text-xl font-bold retro-text">STRUGGLING TO BUILD SOMETHING WITH AI?</h2>
        <ChevronRight className="w-6 h-6" />
      </div>
      <div className="p-6">
        {/* Retro-styled intro text */}
        <div className="text-center mb-6">
          <p className="text-cyan-400 retro-text text-lg mb-2">SCHEDULE AN IMPLEMENTATION CALL</p>
          <p className="text-gray-300 text-xs">Jordan Urbs will help you solve that problem you've been struggling with. We make progress or your money back.</p>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 text-sm">Loading calendar...</p>
          </div>
        )}

        {/* Calendar container with retro styling */}
        <div className="calendar-container relative" style={{ height: "600px" }}>
          {/* Cal.com inline embed container */}
          <div 
            style={{
              width: "100%",
              height: "100%",
              overflow: "scroll",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }} 
            id="my-cal-inline"
          ></div>

          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none calendar-scanlines"></div>

          {/* Retro border */}
          <div className="absolute inset-0 pointer-events-none calendar-border"></div>
        </div>
      </div>
    </section>
  )
}
