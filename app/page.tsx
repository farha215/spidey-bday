"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { MemoryModal } from "@/components/memory-modal";
import { LetterModal } from "@/components/letter-modal";
import { sound } from "@/lib/sound";
import {
  getSoundPreference,
  isBootComplete,
  markBootComplete,
  setSoundPreference,
} from "@/lib/storage";

const TrackerMap = dynamic(
  () => import("@/components/tracker-map").then((m) => m.TrackerMap),
  { ssr: false },
);

type Stage = "checking" | "welcome" | "tutorial" | "initmap" | "live";
type PanelState = { type: "none" } | { type: "memory"; index: number } | { type: "letter" } | { type: "guide" };

export default function Home() {
  const [stage, setStage] = useState<Stage>("checking");
  const booted = stage === "live";
  const [muted, setMuted] = useState(true);
  const [activePanel, setActivePanel] = useState<PanelState>({ type: "none" });

  const finishBoot = useCallback((playIntro: boolean) => {
    markBootComplete();
    setSoundPreference(sound.isEnabled());
    if (playIntro) {
      setStage("initmap");
      setTimeout(() => {
        setStage("live");
        sound.play("jingle", 0.22);
        setTimeout(() => sound.say("welcome"), 1200);
      }, 1500);
    } else {
      setStage("live");
    }
  }, []);

  useEffect(() => {
    if (isBootComplete()) {
      const soundOn = getSoundPreference();
      if (soundOn) sound.enable();
      setMuted(!soundOn);
      setStage("live");
    } else {
      finishBoot(true);
    }
  }, [finishBoot]);

  const openMemory = (idx: number) => {
    sound.play("panel-open", 0.45);
    setActivePanel({ type: "memory", index: idx });
  };

  const openLetter = () => {
    sound.play("panel-open", 0.45);
    setActivePanel({ type: "letter" });
  };

  const closePanel = () => {
    sound.play("panel-open", 0.3);
    setActivePanel({ type: "none" });
  };

  return (
    <main className="flex h-dvh flex-col bg-[#0a0a0a]">
      {/* HEADER LOGO */}
      <div className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-4 border-[#2a9ac0] bg-[#5ac8ec] px-2 shadow-[0_0_15px_rgba(90,200,236,0.5)]">
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white shadow-[0_0_10px_rgba(255,64,64,0.6)]">
          <img src="/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="flex items-center gap-2 font-pixel-body text-[10px] tracking-widest text-[#0a0a0a]">
          SPIDEY
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white">
            <img src="/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
          </div>
          TRACKER
        </div>
        <div onClick={openLetter} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-[#2a9ac0] bg-[#2a9ac0]">
          <img src="/assets/pin-spider.png" alt="Letter" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-1 pt-16 pb-1">
        <div className="relative h-full overflow-hidden border-[10px] border-[#5ac8ec] bg-[#04040e]">
          <div className="scanlines pointer-events-none absolute inset-0 z-50" />
          
          <div className="absolute inset-0 overflow-hidden">
            {(stage === "live" || stage === "initmap") && (
              <TrackerMap
                extraPins={[
                  { id: "mem0", lat: 11.2626, lng: 75.7746, pinType: "memory", title: "MEMORY 1", createdAt: new Date().toISOString() },
                  { id: "mem1", lat: 11.2540, lng: 75.7862, pinType: "memory", title: "MEMORY 2", createdAt: new Date().toISOString() },
                  { id: "mem2", lat: 11.2685, lng: 75.7830, pinType: "memory", title: "MEMORY 3", createdAt: new Date().toISOString() },
                  { id: "mem3", lat: 11.2497, lng: 75.7760, pinType: "memory", title: "MEMORY 4", createdAt: new Date().toISOString() },
                  { id: "letter", lat: 11.2588, lng: 75.7810, pinType: "letter", title: "LETTER", createdAt: new Date().toISOString() },
                ]}
                hiddenTypes={[]}
                focusPinId={activePanel.type === "memory" ? `mem${activePanel.index}` : activePanel.type === "letter" ? "letter" : null}
                onPinFocus={(id) => {
                  if (id === "letter") setActivePanel({ type: "letter" });
                  else if (id?.startsWith("mem")) setActivePanel({ type: "memory", index: parseInt(id.replace("mem", "")) });
                }}
              />
            )}

            <div className="screen-depth" aria-hidden />

            {stage === "checking" && (
              <div className="absolute inset-0 z-40 bg-[#0a0a0a]" />
            )}
            
            {stage === "initmap" && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0a0a0a]">
                <p className="blink font-pixel-body text-[11px] tracking-widest text-[#5ac8ec]">
                  INITIALIZING MAP...
                </p>
              </div>
            )}

            <div className="ruler-h pointer-events-none absolute left-10 right-10 top-0 z-10 opacity-70" />
            <div className="ruler-v pointer-events-none absolute bottom-10 left-0 top-10 z-10 opacity-70" />
            <div className="ruler-v pointer-events-none absolute bottom-10 right-0 top-10 z-10 opacity-70" style={{ transform: "scaleX(-1)" }} />

            {activePanel.type === "memory" && (
              <MemoryModal index={activePanel.index} onClose={closePanel} />
            )}
            {activePanel.type === "letter" && (
              <LetterModal onClose={closePanel} />
            )}

            {/* SIDEBAR TABS */}
            {booted && (
              <div className="absolute left-0 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
                <button onClick={() => openMemory(0)} className="flex h-10 w-10 cursor-pointer items-center justify-center bg-[#ff4040] text-white shadow-[0_0_12px_rgba(255,64,64,0.6)]" style={{ clipPath: "polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)" }}>
                  <span className="font-pixel-body text-[8px]">M1</span>
                </button>
                <button onClick={() => openMemory(1)} className="flex h-10 w-10 cursor-pointer items-center justify-center bg-[#ff4040] text-white shadow-[0_0_12px_rgba(255,64,64,0.6)]" style={{ clipPath: "polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)" }}>
                  <span className="font-pixel-body text-[8px]">M2</span>
                </button>
                <button onClick={openLetter} className="flex h-10 w-10 cursor-pointer items-center justify-center bg-[#2aaa90] text-white shadow-[0_0_12px_rgba(42,170,144,0.6)]" style={{ clipPath: "polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)" }}>
                  <span className="font-pixel-body text-[8px]">LTR</span>
                </button>
                <div className="mt-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white shadow-[0_0_10px_rgba(255,64,64,0.6)]">
                  <img src="/assets/spidey-face.png" alt="" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
                </div>
              </div>
            )}

            {/* CHIBI SPIDEY */}
            {booted && (
              <div className="pointer-events-none absolute bottom-4 left-4 z-20 animate-bounce rounded-sm bg-white/80 p-[2px]">
                <img src="/assets/spiderman-walk.png" alt="" className="h-12 w-auto pixelated" />
              </div>
            )}
            
            {/* SOUND TOGGLE */}
            {booted && (
              <button
                type="button"
                onClick={() => {
                  const on = sound.toggle();
                  setMuted(!on);
                  setSoundPreference(on);
                }}
                className="bit-border absolute right-2 top-2 z-50 flex h-8 w-8 cursor-pointer items-center justify-center font-pixel-body text-[8px] text-[#5ac8ec] hover:opacity-80"
                style={{ "--bb-step": "2px", "--bb-frame": "#5ac8ec", "--bb-fill": "#0a0a0a" } as any}
              >
                {muted ? "×" : "♪"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="z-50 flex flex-col gap-1.5 border-t-4 border-[#2a9ac0] bg-[#5ac8ec] p-2">
        <div className="flex items-center gap-1.5">
          <span className="flex-shrink-0 rounded-full border-2 border-[#2a9ac0] bg-white/30 px-1.5 py-1 text-center font-pixel-body text-[6px] text-[#0a0a0a] min-w-[28px]">M.1</span>
          <button onClick={() => openMemory(0)} className="flex-1 cursor-pointer rounded-full bg-[#d45a30] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #8a2a10" }}>MEMORY 1</button>
          <button onClick={() => openMemory(1)} className="flex-1 cursor-pointer rounded-full bg-[#d45a30] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #8a2a10" }}>MEMORY 2</button>
          <button onClick={openLetter} className="flex-1 cursor-pointer rounded-full bg-[#c89a10] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #7a5a00" }}>LETTER</button>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex-shrink-0 rounded-full border-2 border-[#2a9ac0] bg-white/30 px-1.5 py-1 text-center font-pixel-body text-[6px] text-[#0a0a0a] min-w-[28px]">M.2</span>
          <button onClick={() => openMemory(2)} className="flex-1 cursor-pointer rounded-full bg-[#d45a30] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #8a2a10" }}>MEMORY 3</button>
          <button onClick={() => openMemory(3)} className="flex-1 cursor-pointer rounded-full bg-[#d45a30] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #8a2a10" }}>MEMORY 4</button>
          <button onClick={() => setActivePanel({ type: "guide" })} className="flex-1 cursor-pointer rounded-full bg-[#2aaa90] py-2 font-pixel-body text-[6px] text-white hover:brightness-110" style={{ boxShadow: "0 3px 0 #0e6b58" }}>GUIDE</button>
        </div>
      </div>
    </main>
  );
}
