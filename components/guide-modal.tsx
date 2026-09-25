"use client";

import React from "react";

export function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
      {/* Invisible backdrop click-catcher */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto" 
        onClick={onClose} 
      />

      {/* 8-Bit Pixel Stepped Card */}
      <div 
        className="bit-border relative z-10 w-full max-w-sm p-4 font-pixel-body shadow-[6px_6px_0px_rgba(0,0,0,0.8)] pointer-events-auto select-none max-h-[85vh] flex flex-col" 
        style={{ 
          "--bb-step": "4px", 
          "--bb-frame": "#000000", 
          "--bb-fill": "#ded6be" 
        } as any}
      >
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-2 border-b-2 border-black/10 pb-1 shrink-0">
            <div className="bg-[#b85c5c] px-2 py-0.5 text-white font-pixel-body text-[9px] tracking-wider font-bold shadow-[1px_1px_0px_rgba(0,0,0,0.4)] flex items-center gap-1">
              <span>🕷️</span>
              <span>SPIDEY TRACKER GUIDE</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-pixel-body text-xs font-bold text-black hover:bg-black/10 active:scale-95"
              aria-label="Close Guide"
            >
              ✕
            </button>
          </div>

          {/* INSTRUCTIONS CONTENT */}
          <div className="space-y-3 font-pixel-body text-[8px] text-[#2a241e] overflow-y-auto pr-1 my-1">
            <div className="bg-[#5a9cba]/15 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-0.5 flex items-center gap-1">
                <span>🗺️</span> <span>EXPLORE THE MAP</span>
              </h4>
              <p className="leading-relaxed">
                Drag, pan, and zoom around the global radar to discover secret memory nodes hidden across cities worldwide!
              </p>
            </div>

            <div className="bg-[#e6ad28]/15 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-0.5 flex items-center gap-1">
                <span>📍</span> <span>VIEW MEMORY NODES</span>
              </h4>
              <p className="leading-relaxed">
                Click any map marker to open its memory card. View photos, dates, locations, and special stories!
              </p>
            </div>

            <div className="bg-[#2d7d54]/15 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-0.5 flex items-center gap-1">
                <span>⭐</span> <span>ADD NEW MEMORY NODE</span>
              </h4>
              <p className="leading-relaxed">
                Click the top-right grey star button <span className="font-bold">[+]</span> to drop a new memory. Search any location, pick a group symbol, choose a date using the calendar picker, and attach a photo!
              </p>
            </div>

            <div className="bg-[#8F2867]/10 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-1 flex items-center gap-1">
                <span>👥</span> <span>4 NODE GROUPS & FILTERS</span>
              </h4>
              <p className="leading-relaxed mb-1.5">
                Use the left console sidebar tabs to toggle node categories on/off:
              </p>
              <div className="grid grid-cols-2 gap-1 text-[7.5px] font-bold">
                <div className="flex items-center gap-1 bg-[#8F2867] text-white p-1 border border-black">
                  <span>⭐</span> <span>MANAV (ORCA)</span>
                </div>
                <div className="flex items-center gap-1 bg-[#FFB5E6] text-black p-1 border border-black">
                  <span>🐰</span> <span>FARHA (BUNNY)</span>
                </div>
                <div className="flex items-center gap-1 bg-[#b85c5c] text-white p-1 border border-black">
                  <span>🕷️</span> <span>TWIN (SPIDEY)</span>
                </div>
                <div className="flex items-center gap-1 bg-[#E5FAFF] text-black p-1 border border-black">
                  <span>🦭</span> <span>MONA (SEAL)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#b85c5c]/15 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-0.5 flex items-center gap-1">
                <span>📍</span> <span>MULTI-NODE CLUSTERS</span>
              </h4>
              <p className="leading-relaxed">
                If multiple nodes share the exact same location, a <span className="font-bold bg-[#e6ad28] px-1 text-black border border-black">[N NODES]</span> badge will appear. Click it to choose which memory node to view!
              </p>
            </div>

            <div className="bg-[#e6ad28]/20 border-2 border-black p-2">
              <h4 className="font-bold text-black text-[9px] mb-0.5 flex items-center gap-1">
                <span>💌</span> <span>BIRTHDAY LETTER</span>
              </h4>
              <p className="leading-relaxed">
                Click the top-left circular letter badge to read the birthday letter anytime!
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 border-2 border-black bg-[#2d7d54] py-1.5 font-pixel-body text-[9px] font-bold text-white shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-[#369665] active:translate-y-0.5 cursor-pointer shrink-0"
          >
            GOT IT! CLOSE GUIDE 🕷️
          </button>
        </div>
      </div>
    </div>
  );
}
