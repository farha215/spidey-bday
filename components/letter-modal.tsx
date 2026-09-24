"use client";

import React from "react";

export function LetterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
      {/* Invisible backdrop click-catcher so clicking outside closes it without dimming the map */}
      <div 
        className="absolute inset-0 pointer-events-auto" 
        onClick={onClose} 
      />

      {/* 8-Bit Pixel Stepped Window */}
      <div 
        className="bit-border relative z-10 w-full max-w-sm p-4 font-pixel-body shadow-[6px_6px_0px_rgba(0,0,0,0.8)] pointer-events-auto" 
        style={{ 
          "--bb-step": "4px", 
          "--bb-frame": "#000000", 
          "--bb-fill": "#ded6be" 
        } as any}
      >
        {/* Scanlines Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ 
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px)" 
          }} 
        />

        <div className="relative z-10">
          {/* TOP BAR: Red badge & X button */}
          <div className="flex items-center justify-between mb-3">
            <div className="bg-[#d83a3a] px-2 py-0.5 text-white font-pixel-body text-[9px] tracking-wider font-bold shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
              LETTER
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-pixel-body text-xs font-bold text-black hover:bg-black/10 active:scale-95 border border-transparent hover:border-black/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* TITLE */}
          <h2 className="font-pixel-body text-[13px] font-bold tracking-wider text-black mb-3 border-b-2 border-black/10 pb-1">
            LETTER
          </h2>

          {/* LETTER CONTENT */}
          <div className="space-y-3 font-pixel-body text-[9px] leading-relaxed text-[#2a241e] max-h-[280px] overflow-y-auto pr-1">
            <p className="font-bold text-[#b83232]">🕸 HAPPY BIRTHDAY TWIN 🕸</p>
            <p>hey twin,</p>
            <p>
              idk how to start this without being cringe lol but here goes nothing.
            </p>
            <p>
              you mean a lot to me and i wanted to do something actually special for your birthday this year — so i built this whole spidey tracker just for you, because we both know you would've loved this if it was real 😭
            </p>
            <p>
              i put some of our best memories on the map so you can tap through them. each one means something to me even if we never talk about it.
            </p>
            <p>
              i hope this year is everything you want it to be. you deserve it for real. no cap.
            </p>
            <p>
              happy birthday twin. you're one of a kind and i'm glad we found each other. 🕷
            </p>
            <div className="pt-2 border-t border-black/10 text-[9px] text-[#4a4238]">
              — your twin 🖤<br/>
              <span className="text-[7px] text-[#7a7060]">[ your friendly neighborhood bestie ]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
