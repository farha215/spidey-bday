"use client";

import React from "react";

export function LetterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-x-4 top-10 bottom-14 z-50 panel-in flex flex-col justify-end sm:inset-x-8 sm:bottom-20">
      <div className="bit-border bg-[#0a0a18] p-5 shadow-2xl" style={{ "--bb-step": "3px", "--bb-frame": "#5ac8ec", "--bb-fill": "#0a0a18" } as any}>
        <button
          onClick={onClose}
          className="absolute right-0 top-[-30px] bit-border z-50 flex h-8 w-8 cursor-pointer items-center justify-center bg-[#ff4040] font-pixel-body text-[8px] text-white hover:opacity-85"
          style={{ "--bb-step": "2px", "--bb-frame": "#ff4040", "--bb-fill": "#ff4040" } as any}
        >
          ✕
        </button>
        <div className="mb-4 flex items-center gap-2 font-pixel-body text-[7px] tracking-widest text-[#ff4040]">
          <span className="h-2 w-2 bg-[#ff4040]"></span> SECRET MESSAGE
        </div>
        
        <div className="mb-4 border-2 border-[#ff4040] bg-gradient-to-br from-[#7f1d1d] to-[#1d3461] p-3 text-center">
          <p className="font-pixel-body text-[8px] leading-loose text-[#fca5a5]">🕸 HAPPY BIRTHDAY <span className="text-[#fde68a]">TWIN</span> 🕸</p>
        </div>
        
        <div className="mb-4 font-pixel-body text-[12px] text-[#ff4040]" style={{ textShadow: "0 0 14px rgba(255,64,64,0.6)" }}>
          HEY TWIN,
        </div>
        
        <div className="font-pixel-body text-[7px] leading-loose text-[#93c5fd]">
          idk how to start this without being cringe lol but here goes nothing.<br/><br/>
          you mean a lot to me and i wanted to do something actually special for your birthday this year — so i built this whole spidey tracker just for you, because we both know you would've loved this if it was real 😭<br/><br/>
          i put some of our best memories on the map so you can tap through them. each one means something to me even if we never talk about it.<br/><br/>
          i hope this year is everything you want it to be. you deserve it for real. no cap.<br/><br/>
          happy birthday twin. you're one of a kind and i'm glad we found each other. 🕷
        </div>
        
        <div className="mt-5 font-pixel-body text-[8px] text-white">
          — your twin 🖤<br/>
          <span className="text-[6px] text-[#5ac8ec] opacity-80">[ your friendly neighborhood bestie ]</span>
        </div>
        
        <div className="mt-4 animate-bounce text-center text-xl">🕷 🕸 🕷</div>
      </div>
    </div>
  );
}
