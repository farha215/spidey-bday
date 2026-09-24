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

const MAP_LIBRARIES: any[] = ["marker"];

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
    <div className="flex min-h-dvh items-center justify-center bg-[#1c4c7c]">
      <APIProvider apiKey="AIzaSyDhFTe_7TYC4vcCSntJmbIVQcXTjjZuXcM" libraries={MAP_LIBRARIES} onError={(err) => console.error("Google Maps Error:", err)}>
        <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#2c6c8c] border-x-4 border-black shadow-[0_0_50px_rgba(90,200,236,0.15)]">
          {/* SIDEBAR TABS */}
          {booted && (
            <div className="absolute left-0 top-1/3 z-50 flex -translate-y-1/2 flex-col gap-1">
              <button 
                onClick={() => setActivePanel({ type: "none" })} 
                className="group relative flex h-[46px] w-[58px] cursor-pointer items-center justify-center transition-transform hover:translate-x-1"
              >
                <svg viewBox="0 0 58 46" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]" preserveAspectRatio="none">
                  <path d="M0,2 L44,2 L56,23 L44,44 L0,44" fill="#6a9a6c" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="miter" />
                  <path d="M0,6 L38,6 L48,23" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" />
                </svg>
                <img src="/spidey-bday/assets/spider-black.png" alt="" className="relative z-10 mr-1 h-7 w-7 object-contain pixelated opacity-90" style={{ mixBlendMode: 'multiply' }} />
              </button>
              <button 
                onClick={() => setActivePanel({ type: "none" })} 
                className="group relative flex h-[46px] w-[58px] cursor-pointer items-center justify-center transition-transform hover:translate-x-1"
              >
                <svg viewBox="0 0 58 46" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]" preserveAspectRatio="none">
                  <path d="M0,2 L44,2 L56,23 L44,44 L0,44" fill="#b85c5c" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="miter" />
                  <path d="M0,6 L38,6 L48,23" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" />
                </svg>
                <img src="/spidey-bday/assets/spider-black.png" alt="" className="relative z-10 mr-1 h-7 w-7 object-contain pixelated opacity-90" style={{ mixBlendMode: 'multiply' }} />
              </button>
            </div>
          )}
        <div className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-4 border-[#5a9cba] bg-[#96e0f7] px-2 shadow-[0_0_15px_rgba(150,224,247,0.5)]">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#ffc619] bg-white shadow-[0_0_10px_rgba(255,198,25,0.6)]">
            <img src="/spidey-bday/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated animate-spidey-hang" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="flex items-center gap-2 font-pixel-body text-[10px] tracking-widest text-[#0a0a0a]">
            SPIDEY
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-[#ffc619] bg-white">
              <img src="/spidey-bday/assets/spidey-face.png" alt="Guide" className="h-full w-full object-cover pixelated animate-spidey-hang" style={{ mixBlendMode: 'multiply', animationDelay: '2s' }} />
            </div>
            TRACKER<span className="title-cursor"></span>
          </div>
          <div onClick={openLetter} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-[#5a9cba] bg-[#5a9cba]">
            <img src="/spidey-bday/assets/pin-spider.png" alt="Letter" className="h-full w-full object-cover pixelated" style={{ mixBlendMode: 'multiply' }} />
          </div>
        </div>

        <div className="relative min-h-0 flex-1 px-4 pt-16 pb-1">
          <div className="relative h-full overflow-hidden border-4 border-black bg-[#04040e]">
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
                  <p className="blink font-pixel-body text-[11px] tracking-widest text-[#96e0f7]">
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

              {/* SIDEBAR TABS MOVED TO MAIN CONTAINER */}

              {/* CHIBI SPIDEY (removed from inner map) */}
            </div>
          </div>
        </div>

        {/* BOTTOM TICKER PANEL */}
        <div className="relative z-50 flex h-14 w-full shrink-0 items-center gap-2 border-t-4 border-black bg-transparent py-2 pr-2 pl-14">
          {/* OVERLAPPING SPIDEY AVATAR */}
          <div className="absolute -left-2 bottom-0 z-50 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[4px] border-[#0a0a0a] bg-[#5a9cba] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <img src="/spidey-bday/assets/spiderman-walk.png" alt="" className="h-12 w-auto pixelated drop-shadow-[0_2px_0_rgba(0,0,0,1)] animate-spidey-idle" />
          </div>

          {/* SCROLLING TICKER PILL */}
          <div className="btn-3d flex h-full flex-1 items-center overflow-hidden font-pixel-body text-[8px] tracking-widest text-white" style={{ "--btn-color": "#1a1a1a", "--bevel-light": "rgba(255,255,255,0.15)", "--bevel-dark": "rgba(0,0,0,0.6)" } as any}>
            {muted ? (
              <div className="flex w-full items-center justify-center pt-1 animate-pulse">
                SELECT SOUND OPTION
              </div>
            ) : (
              <div className="ticker-track flex w-max items-center h-full pt-1 text-[#96e0f7]">
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
            className="btn-3d flex h-full w-14 cursor-pointer items-center justify-center pt-1"
            style={{ 
              "--btn-color": muted ? "#d4d4d4" : "#6a9a6c", 
              "--bevel-light": muted ? "rgba(255,255,255,0.8)" : "#90c292", 
              "--bevel-dark": muted ? "rgba(0,0,0,0.4)" : "#3b5f3c" 
            } as any}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -mt-1"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -mt-1"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            )}
          </button>
        </div>
      </main>
      </APIProvider>
    </div>
  );
}
