"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";

export function PasscodeGate({ 
  onUnlock 
}: { 
  onUnlock: () => void 
}) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Accepted secret passcode
  const VALID_CODES = ["2692006"];

  const handleKeyClick = (char: string) => {
    sound.play("pin-click", 0.3);
    setErrorMsg(null);
    if (code.length < 12) {
      setCode((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    sound.play("pin-click", 0.3);
    setErrorMsg(null);
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.play("pin-click", 0.3);
    setErrorMsg(null);
    setCode("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = code.trim().toUpperCase();
    
    if (VALID_CODES.includes(clean)) {
      sound.play("jingle", 0.3);
      try {
        sessionStorage.setItem("spidey_unlocked", "true");
        localStorage.removeItem("spidey_unlocked");
      } catch (err) {}
      onUnlock();
    } else {
      sound.play("panel-open", 0.5);
      setErrorMsg("ACCESS DENIED • WRONG PASSCODE");
      setTimeout(() => setErrorMsg(null), 2500);
    }
  };

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0a0a14] font-pixel-body select-none">
      {/* SCANLINES */}
      <div className="scanlines pointer-events-none absolute inset-0 z-10 opacity-60" />

      {/* 8-BIT STEPPED PASSCARD */}
      <div 
        className="bit-border relative z-20 w-full max-w-xs p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.9)] flex flex-col items-center text-center"
        style={{ 
          "--bb-step": "4px", 
          "--bb-frame": "#000000", 
          "--bb-fill": "#ded6be" 
        } as any}
      >
        <div className="bg-[#b85c5c] px-2.5 py-1 text-white font-pixel-body text-[9px] tracking-widest font-bold mb-3 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
          🔒 CLASSIFIED ACCESS
        </div>

        <p className="font-pixel-body text-[9px] text-[#2a241e] font-bold mb-3 tracking-wider">
          ENTER SECRET PASSCODE
        </p>

        {/* MASKED CODE DISPLAY BOX */}
        <form onSubmit={handleSubmit} className="w-full mb-3">
          <div className="relative w-full border-2 border-black bg-black p-2 flex items-center justify-center h-10 shadow-[inset_2px_2px_0px_rgba(255,255,255,0.2)]">
            <span className="font-pixel-body text-sm tracking-[6px] text-[#96e0f7]">
              {code ? "•".repeat(code.length) : <span className="text-[#444] text-[10px] tracking-normal">ENTER CODE...</span>}
            </span>
          </div>
        </form>

        {errorMsg && (
          <div className="text-[8px] font-bold text-[#b85c5c] mb-3 tracking-wider animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* 8-BIT NUMERIC KEYPAD */}
        <div className="grid grid-cols-3 gap-1.5 w-full mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyClick(num)}
              className="border-2 border-black bg-[#e6ad28] py-1.5 font-pixel-body text-[11px] font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.6)] hover:bg-[#ffe066] active:translate-y-0.5 cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="border-2 border-black bg-[#c4c4c4] py-1.5 font-pixel-body text-[9px] font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.6)] hover:bg-white active:translate-y-0.5 cursor-pointer"
          >
            DEL
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick("0")}
            className="border-2 border-black bg-[#e6ad28] py-1.5 font-pixel-body text-[11px] font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.6)] hover:bg-[#ffe066] active:translate-y-0.5 cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="border-2 border-black bg-[#b85c5c] py-1.5 font-pixel-body text-[9px] font-bold text-white shadow-[2px_2px_0px_rgba(0,0,0,0.6)] hover:bg-[#d86c6c] active:translate-y-0.5 cursor-pointer"
          >
            CLEAR
          </button>
        </div>

        {/* ENTER UNLOCK BUTTON */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full border-2 border-black bg-[#2d7d54] py-2 font-pixel-body text-[10px] font-bold text-white tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-[#369665] active:translate-y-0.5 cursor-pointer"
        >
          UNLOCK ACCESS 🕷️
        </button>
      </div>
    </div>
  );
}
