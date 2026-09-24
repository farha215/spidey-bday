"use client";

import React from "react";

export interface Memory {
  id: string;
  title: string;
  location?: string;
  date?: string;
  caption: string;
  photo: string;
  lat: number;
  lng: number;
  nodeType?: "star" | "bunny" | "spidey";
}

export const MEMORIES: Memory[] = [
  { 
    id: "mem0", 
    title: "MANAV'S MEMORY ⭐", 
    location: "Kozhikode, India", 
    date: "OCT 12, 2022",
    caption: "Manav's special memory node on the map.", 
    photo: "/spidey-bday/assets/symbol-star.png",
    lat: 11.2626, 
    lng: 75.7746,
    nodeType: "star"
  },
  { 
    id: "mem1", 
    title: "FARHA'S MEMORY 🐰", 
    location: "Beach Road", 
    date: "JAN 05, 2023",
    caption: "Farha's special memory node on the map.", 
    photo: "/spidey-bday/assets/symbol-bunny.png",
    lat: 11.2540, 
    lng: 75.7862,
    nodeType: "bunny"
  },
  { 
    id: "mem2", 
    title: "TWIN MEMORY 🕷️", 
    location: "The Hangout Spot", 
    date: "JUL 20, 2023",
    caption: "Twin shared memory node on the map.", 
    photo: "/spidey-bday/assets/pin-spider-transparent.png",
    lat: 11.2685, 
    lng: 75.7830,
    nodeType: "spidey"
  }
];

export function MemoryModal({ 
  index, 
  memoryId,
  customMemories = [],
  onClose 
}: { 
  index?: number; 
  memoryId?: string;
  customMemories?: Memory[];
  onClose: () => void; 
}) {
  const allMems = [...customMemories, ...MEMORIES];
  const m = allMems.find(x => x.id === memoryId) || allMems[index ?? 0] || MEMORIES[0];

  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
      {/* Invisible backdrop click-catcher */}
      <div 
        className="absolute inset-0 pointer-events-auto" 
        onClick={onClose} 
      />

      {/* 8-Bit Pixel Stepped Card */}
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
          {/* TOP BAR: Tag badge & X button */}
          <div className="flex items-center justify-between mb-3">
            <div className="bg-[#2d7d54] px-2 py-0.5 text-white font-pixel-body text-[9px] tracking-wider font-bold shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
              MEMORY NODE
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

          {/* PHOTO FRAME */}
          <div className="mb-3 flex aspect-video w-full items-center justify-center overflow-hidden border-2 border-black bg-black/10">
            {m.photo ? (
              <img src={m.photo} alt={m.title} className="h-full w-full object-cover" />
            ) : (
              <div className="text-center font-pixel-body text-[8px] text-[#555]">📷 NO PHOTO YET</div>
            )}
          </div>

          {/* TITLE & METADATA */}
          {m.title ? (
            <h3 className="font-pixel-body text-[12px] font-bold text-black mb-1">
              {m.title}
            </h3>
          ) : null}
          {(m.location || m.date) && (
            <div className="flex items-center justify-between text-[7px] text-[#6b6255] mb-2 border-b border-black/10 pb-1">
              <span>📍 {m.location ?? "SECRET LOCATION"}</span>
              <span>📅 {m.date ?? "2024"}</span>
            </div>
          )}

          {/* CAPTION DESCRIPTION */}
          {m.caption ? (
            <p className="font-pixel-body text-[9px] leading-relaxed text-[#2a241e]">
              {m.caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
