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
          <h2 className="font-pixel-body text-[12px] font-bold tracking-wider text-[#b83a3a] flex items-center justify-center gap-1.5 mb-3 border-b-2 border-black/10 pb-1">
            <span>🕸️</span>
            <span>HAPPY BIRTHDAY</span>
            <span>🕸️</span>
          </h2>

          {/* LETTER CONTENT */}
          <div className="space-y-3 font-pixel-body text-[9px] leading-relaxed text-[#2a241e] max-h-[280px] overflow-y-auto pr-1">
            <p className="font-bold">HII twin!! Happy Birthday! 🎈</p>
            <p>
              You can't call me old anymore, I can't believe we’re both 20 now, isn't that insane?
            </p>
            <p>
              This year has been insane, so much has happened, good and bad, but at the end of it all, I'm going to come out of this year having so many amazing memories of us. I would’ve never in a million years believed that I'd have a best friend who I genuinely feel is going to be in my life forever. Friendships for me have always been temporary with moving around a lot and just never feeling like I'm truly myself around people, but you've challenged that belief and proved me wrong.
            </p>
            <p>
              I know we appreciate each other often, but words can't portray how important you are to me. I owe my sanity to having you to fall back on and talk to. Life is hectic and busy and I'm still figuring out how to navigate it, but you help me out with it so, so much.
            </p>
            <p>
              This past year has been a rollercoaster for you too. I know you've had to deal with a lot, but I'm so, so proud of you for getting through it all and throughout it managing to show up for the people around you who need you. Life is throwing a lot of things at you that might make you doubt yourself, but I want you to never, ever forget how capable you are. You are meant for SO SO much more than you realize, and the people in your life who love you can see and recognize that, and I hope you do too. It is okay to not have everything figured out, trust that things will fall into place, but never, ever give up okay? Whatever happens, you have people to help you back up, and most importantly, yourself.
            </p>
            <p>
              I hope you have an amazing year ahead of you! This is just the start of your adulthood, so many experiences and memories are waiting for you and I can't wait to be there through it all. I hope you like the website and that we’re able to fill it with SO many memory nodes together! I CAN'T WAIT! 🕷️
            </p>
            <div className="pt-2 border-t border-black/10 text-[9px] text-[#4a4238]">
              with love, your awesome cool super funny pretty twin 🖤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
