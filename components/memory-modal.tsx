"use client";

import React from "react";

interface Memory {
  title: string;
  caption: string;
  photo: string;
}

export const MEMORIES: Memory[] = [
  { title: "MEMORY #1", caption: "This is our first memory together. Time flies!", photo: "/assets/pin-spider.png" },
  { title: "MEMORY #2", caption: "Remember this day? It was unforgettable.", photo: "/assets/pin-spider.png" },
  { title: "MEMORY #3", caption: "I still laugh when I think about this.", photo: "/assets/pin-spider.png" },
  { title: "MEMORY #4", caption: "One of my favorite moments of all time.", photo: "/assets/pin-spider.png" }
];

export function MemoryModal({ index, onClose }: { index: number; onClose: () => void }) {
  const m = MEMORIES[index];
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
        <div className="mb-4 flex items-center gap-2 font-pixel-body text-[7px] tracking-widest text-[#4ade80]">
          <span className="h-2 w-2 bg-[#4ade80]"></span> CONFIRMED SIGHTING
        </div>
        <div className="mb-4 flex aspect-video w-full items-center justify-center overflow-hidden border-2 border-[#5ac8ec] bg-[#111827]">
          {m.photo ? (
            <img src={m.photo} alt={m.title} className="h-full w-full object-cover" />
          ) : (
            <div className="text-center font-pixel-body text-[6px] text-[#5ac8ec] opacity-60">📷 NO PHOTO</div>
          )}
        </div>
        <h3 className="mb-2 font-pixel-body text-[9px] text-white">{m.title}</h3>
        <p className="font-pixel-body text-[7px] leading-loose text-[#5ac8ec]">{m.caption}</p>
      </div>
    </div>
  );
}
