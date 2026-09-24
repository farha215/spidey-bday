"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { MemoryModal } from "@/components/memory-modal";
import { LetterModal } from "@/components/letter-modal";
import { BootSequence } from "@/components/boot-sequence";
import { APIProvider } from "@vis.gl/react-google-maps";
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
    const soundOn = getSoundPreference();
    if (soundOn) sound.enable();
    setMuted(!soundOn);
  }, []);

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
    <div className="flex min-h-dvh items-center justify-center bg-black">
      <APIProvider apiKey="AIzaSyDhFTe_7TYC4vcCSntJmbIVQcXTjjZuXcM">
        <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#0a0a0a] shadow-[0_0_50px_rgba(90,200,236,0.15)]">
        {/* HEADER LOGO */}
        <div className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-4 border-[#2a9ac0] bg-[#5ac8ec] px-2 shadow-[0_0_15px_rgba(90,200,236,0.5)]">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white shadow-[0_0_10px_rgba(255,64,64,0.6)]">
            <img src="/spidey-bday/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated animate-spidey-hang" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="flex items-center gap-2 font-pixel-body text-[10px] tracking-widest text-[#0a0a0a]">
            SPIDEY
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white">
              <img src="/spidey-bday/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated animate-spidey-hang" style={{ mixBlendMode: 'multiply', animationDelay: '2s' }} />
            </div>
            TRACKER
          </div>
          <div onClick={openLetter} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-[#2a9ac0] bg-[#2a9ac0]">
            <img src="/spidey-bday/assets/pin-spider.png" alt="Letter" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
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
                <BootSequence onComplete={() => finishBoot(true)} />
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
                <div className="absolute left-0 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1">
                  <button onClick={() => openMemory(0)} className="btn-3d flex h-8 w-8 items-center justify-center font-pixel-body text-[6px]" style={{ "--btn-color": "#d45a30" } as any}>
                    M1
                  </button>
                  <button onClick={() => openMemory(1)} className="btn-3d flex h-8 w-8 items-center justify-center font-pixel-body text-[6px]" style={{ "--btn-color": "#d45a30" } as any}>
                    M2
                  </button>
                  <button onClick={() => openMemory(2)} className="btn-3d flex h-8 w-8 items-center justify-center font-pixel-body text-[6px]" style={{ "--btn-color": "#d45a30" } as any}>
                    M3
                  </button>
                  <button onClick={() => openMemory(3)} className="btn-3d flex h-8 w-8 items-center justify-center font-pixel-body text-[6px]" style={{ "--btn-color": "#d45a30" } as any}>
                    M4
                  </button>
                  <button onClick={openLetter} className="btn-3d flex h-8 w-8 items-center justify-center font-pixel-body text-[6px]" style={{ "--btn-color": "#c89a10" } as any}>
                    LTR
                  </button>
                  <div className="mt-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-[#ff4040] bg-white shadow-[0_0_10px_rgba(255,64,64,0.6)]">
                    <img src="/spidey-bday/assets/spidey-face.png" alt="" className="h-full w-full object-cover pixelated animate-spidey-hang" style={{ mixBlendMode: 'multiply', animationDelay: '1s' }} />
                  </div>
                </div>
              )}

              {/* CHIBI SPIDEY (removed from inner map) */}
            </div>
          </div>
        </div>

        {/* BOTTOM TICKER PANEL */}
        <div className="relative z-50 flex h-14 w-full shrink-0 items-center gap-2 border-t-4 border-[#2a9ac0] bg-[#5ac8ec] py-2 pr-2 pl-12 pb-safe-3">
          {/* OVERLAPPING SPIDEY AVATAR */}
          <div className="absolute -left-2 bottom-0 z-50 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[4px] border-[#0a0a0a] bg-[#2a9ac0] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <img src="/spidey-bday/assets/spiderman-walk.png" alt="" className="h-12 w-auto pixelated drop-shadow-[0_2px_0_rgba(0,0,0,1)] animate-spidey-idle" />
          </div>

          {/* SCROLLING TICKER PILL */}
          <div className="btn-3d flex h-full flex-1 items-center overflow-hidden font-pixel-body text-[8px] tracking-widest text-white" style={{ "--btn-color": "#1a1a1a", "--bevel-light": "rgba(255,255,255,0.15)", "--bevel-dark": "rgba(0,0,0,0.6)" } as any}>
            {muted ? (
              <div className="flex w-full items-center justify-center pt-1 animate-pulse">
                SELECT SOUND OPTION
              </div>
            ) : (
              <div className="ticker-track flex w-max items-center h-full pt-1 text-[#5ac8ec]">
                <span className="whitespace-nowrap px-4">🕷️ SPIDEY TRACKER ONLINE • HAPPY BIRTHDAY TWIN! 🎈 •</span>
                <span className="whitespace-nowrap px-4">🕷️ SPIDEY TRACKER ONLINE • HAPPY BIRTHDAY TWIN! 🎈 •</span>
                <span className="whitespace-nowrap px-4">🕷️ SPIDEY TRACKER ONLINE • HAPPY BIRTHDAY TWIN! 🎈 •</span>
              </div>
            )}
          </div>

          {/* SOUND TOGGLE PILL */}
          <button
            type="button"
            onClick={() => {
              const on = sound.toggle();
              setMuted(!on);
              setSoundPreference(on);
            }}
            className="btn-3d flex h-full aspect-square cursor-pointer items-center justify-center pt-1 font-pixel-body text-[12px] text-black"
            style={{ "--btn-color": "#d4d4d4", "--bevel-light": "rgba(255,255,255,0.8)", "--bevel-dark": "rgba(0,0,0,0.4)" } as any}
          >
            {muted ? "×" : "♪"}
          </button>
        </div>
      </main>
      </APIProvider>
    </div>
  );
}
