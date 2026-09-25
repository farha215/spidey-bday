"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

export function BootSequence({ 
  onComplete,
  onSelectSound 
}: { 
  onComplete: () => void;
  onSelectSound?: (enable: boolean) => void;
}) {
  const [dropProgress, setDropProgress] = useState(false);
  const [symbolBloom, setSymbolBloom] = useState(false);

  useEffect(() => {
    // Start dropping animation smoothly after mount
    const dropTimer = setTimeout(() => {
      setDropProgress(true);
    }, 150);

    // Trigger symbol bloom right when Spider-Man reaches the bottom of the drop!
    const bloomTimer = setTimeout(() => {
      setSymbolBloom(true);
    }, 2100);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(bloomTimer);
    };
  }, []);

  const handleSoundChoice = (enableSound: boolean) => {
    if (enableSound) {
      sound.enable();
      sound.play("jingle", 0.3);
    } else {
      sound.disable();
    }
    onSelectSound?.(enableSound);
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end items-center p-5 pb-6 overflow-hidden font-pixel-body select-none bg-[#1e2226]">
      {/* BACKGROUND SPIDER SYMBOL EMBLEM - BLOOMS OUT FROM BEHIND SPIDEY'S HEAD */}
      <div className="absolute top-[95px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Radial Cyan Bloom Glow */}
        <div 
          className={`absolute w-[350px] h-[350px] rounded-full transition-all duration-1000 ease-out ${
            symbolBloom ? "scale-100 opacity-60" : "scale-25 opacity-0"
          }`}
          style={{
            background: "radial-gradient(circle at center, rgba(150, 224, 247, 0.25) 0%, rgba(90, 156, 186, 0.08) 50%, transparent 75%)",
            filter: "blur(20px)"
          }}
        />

        <img 
          src="/spidey-bday/assets/symbol-transparent.png" 
          alt="" 
          className={`w-[320px] max-w-[85vw] h-auto object-contain pixelated filter drop-shadow-[0_0_20px_rgba(150,224,247,0.35)] brightness-110 transition-all duration-1000 ease-out origin-center ${
            symbolBloom ? "scale-100 opacity-45" : "scale-25 opacity-0"
          }`}
        />
      </div>

      {/* SCANLINES OVERLAY */}
      <div className="scanlines pointer-events-none absolute inset-0 z-10 opacity-60" />

      {/* TOP DROPPING SPIDERMAN & WEB */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-[2500ms] ease-out pointer-events-none"
        style={{ 
          transform: dropProgress ? "translateY(0)" : "translateY(-295px)",
          opacity: dropProgress ? 1 : 0
        }}
      >
        {/* Web string attached directly to the very top edge of the screen */}
        <div className="w-[2px] h-[155px] bg-white opacity-90 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
        
        {/* Spider-Man connected directly to the bottom end of the web line */}
        <div className="-mt-[1px]">
          <img 
            src="/spidey-bday/assets/spidey-drop-transparent.png" 
            alt="Spider-Man" 
            className="w-20 h-auto object-contain pixelated drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" 
          />
        </div>
      </div>

      {/* BOTTOM SECTION: WELCOME TEXT & SOUND BUTTONS */}
      <div className={`relative z-20 flex flex-col items-center text-center gap-4 w-full transition-all duration-700 delay-300 ${dropProgress ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="font-pixel-body text-[12px] sm:text-[13px] leading-relaxed text-[#96e0f7] tracking-widest max-w-[340px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <p>HAPPY BIRTHDAY TWIN!!</p>
          <p>WELCOME TO THE SPIDEY MEMORY TRACKER.</p>
          <p>INTERACT WITH THE MAP TO VIEW</p>
          <p>MEMORIES ALL OVER THE WORLD.</p>
        </div>

        <p className="font-pixel-body text-[9px] tracking-widest text-[#7a9cb0]">
          CHOOSE YOUR SETTINGS AND START TRACKING
        </p>

        {/* SOUND SELECTION BUTTONS */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={() => handleSoundChoice(true)}
            className="btn-3d px-4 py-2 font-pixel-body text-[9px] tracking-wider uppercase text-white shadow-lg"
            style={{ 
              "--btn-color": "#4a7c8c", 
              "--bevel-light": "rgba(255,255,255,0.4)", 
              "--bevel-dark": "rgba(0,0,0,0.5)" 
            } as any}
          >
            SOUND ON
          </button>
          <button
            onClick={() => handleSoundChoice(false)}
            className="btn-3d px-4 py-2 font-pixel-body text-[9px] tracking-wider uppercase text-white shadow-lg opacity-80 hover:opacity-100"
            style={{ 
              "--btn-color": "#2a3036", 
              "--bevel-light": "rgba(255,255,255,0.2)", 
              "--bevel-dark": "rgba(0,0,0,0.6)" 
            } as any}
          >
            SOUND OFF
          </button>
        </div>
      </div>
    </div>
  );
}
