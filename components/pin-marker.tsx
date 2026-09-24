"use client";

import React from "react";
import type { Pin } from "@/lib/tracker";

export function PinMarker({ pin }: { pin: Pin }) {
  const nodeType = (pin as any).nodeType || (
    pin.id === "mem0" ? "star" :
    pin.id === "mem1" ? "bunny" :
    pin.id === "mem2" ? "spidey" :
    pin.id.includes("star") ? "star" :
    pin.id.includes("bunny") ? "bunny" : "spidey"
  );

  if (pin.pinType === "letter" || pin.id === "letter") {
    return (
      <div
        className="relative cursor-pointer transition-transform hover:scale-115 active:scale-95"
        style={{ width: 40, height: 40 }}
        title={pin.title}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#e6ad28] shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
          <img
            src="/spidey-bday/assets/letter-transparent.png"
            alt=""
            className="h-6 w-6 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    );
  }

  if (nodeType === "spidey") {
    return (
      <div
        className="relative cursor-pointer transition-transform hover:scale-115 active:scale-95"
        style={{ width: 44, height: 44 }}
        title={pin.title}
      >
        <img
          src="/spidey-bday/assets/pin-spider-transparent.png"
          alt=""
          className="h-full w-full object-contain pixelated drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
        />
      </div>
    );
  }

  const bgColor = nodeType === "star" ? "#8F2867" : "#FFB5E6";
  const symbolImg = nodeType === "star" ? "/spidey-bday/assets/symbol-star.png" : "/spidey-bday/assets/symbol-bunny.png";

  return (
    <div
      className="relative cursor-pointer transition-transform hover:scale-115 active:scale-95"
      style={{ width: 40, height: 40 }}
      title={pin.title}
    >
      <div 
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-black shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
        style={{ backgroundColor: bgColor }}
      >
        <img
          src={symbolImg}
          alt=""
          className="h-6 w-6 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}
