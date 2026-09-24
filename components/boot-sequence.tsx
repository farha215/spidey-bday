"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

const BOOT_LOGS = [
  "INITIALIZING SPIDEY TRACKER v4.2.0...",
  "BOOTING CORE SERVICES [OK]",
  "INITIALIZING MAP RENDER PIPELINE...",
  "LOADING BASE ASSETS: FRAME UI [OK]",
  "LOADING BASE ASSETS: TICKER MODULE [OK]",
  "STARTING EVENT BUS [OK]",
  "CALIBRATING SPRITESHEET RENDERER [OK]",
  "WARMING IMAGE CACHE...",
  "CHECKING FONT REGISTRY [OK]",
  "VALIDATING ROUTE HANDLERS [OK]",
  "BUILDING API CONNECTION POOL...",
  "AUTHENTICATING SESSION TOKENS [OK]",
  "RUNNING BOOT SELF-TEST: PASS",
  "VERIFYING FEATURE FLAGS [OK]",
  "PRELOADING CRITICAL UI FRAGMENTS...",
  "MOUNTING OVERLAY CONTROLLERS [OK]",
  "SYNCING STATE STORE [OK]",
  "INITIALIZING LIGHTBOX ROUTES...",
  "CHECKING MEDIA GATES [OK]",
  "PATCHING FALLBACK HANDLERS [OK]",
  "SCANNING MODULE DEPENDENCIES...",
  "RESOLVING ASYNC TASK QUEUE [OK]",
  "COMPILING BOOT LOG BUFFER...",
  "VALIDATING RUNTIME CONFIG [OK]"
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    let currentIndex = 0;
    
    // Type out logs rapidly
    const interval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[currentIndex]]);
        // Play a very subtle mechanical typing tick or just rely on visual (sound can get annoying if too fast)
        // sound.play("typing", 0.05); 
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800); // Wait a tiny bit after logs finish before hiding
      }
    }, 60); // fast log scroll

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-40 bg-[#1a1a1a] flex flex-col justify-end p-4 pb-10 overflow-hidden font-mono text-[8px] sm:text-[10px] text-[#888] tracking-widest">
      
      {/* HANGING SPIDEY */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Web string */}
        <div className="w-[2px] h-32 bg-white opacity-80" />
        
        {/* Spidey avatar with animation */}
        <div className="relative -mt-2 animate-spidey-hang">
          <img 
            src="/assets/spider-drop-transparent.png" 
            alt="" 
            className="w-16 h-16 object-contain pixelated" 
          />
        </div>
      </div>

      {/* TERMINAL LOGS */}
      <div className="flex flex-col gap-1 w-full max-w-[90%]">
        {logs.map((log, i) => (
          <div key={i} className="whitespace-nowrap opacity-70 animate-fade-in-fast">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
