"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { MemoryModal, type Memory } from "@/components/memory-modal";
import { LetterModal } from "@/components/letter-modal";
import { AddMemoryModal } from "@/components/add-memory-modal";
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
type PanelState = 
  | { type: "none" } 
  | { type: "memory"; index?: number; id?: string } 
  | { type: "letter" } 
  | { type: "add" };

const MAP_LIBRARIES: any[] = ["marker"];

export default function Home() {
  const [stage, setStage] = useState<Stage>("checking");
  const booted = stage === "live";
  const [muted, setMuted] = useState(true);
  const [activePanel, setActivePanel] = useState<PanelState>({ type: "none" });

  const [starActive, setStarActive] = useState(true);
  const [bunnyActive, setBunnyActive] = useState(true);
  const [spideyActive, setSpideyActive] = useState(true);

  const [customMemories, setCustomMemories] = useState<Memory[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("spidey_custom_memories");
      if (saved) {
        setCustomMemories(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load custom memories", err);
    }
  }, []);

  const handleSaveMemory = (newMem: Memory) => {
    const updated = [...customMemories, newMem];
    setCustomMemories(updated);
    try {
      localStorage.setItem("spidey_custom_memories", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save custom memory", err);
    }
    sound.play("panel-open", 0.45);
  };

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

  const openLetter = () => {
    sound.play("panel-open", 0.45);
    setActivePanel({ type: "letter" });
  };

  const closePanel = () => {
    sound.play("panel-open", 0.3);
    setActivePanel({ type: "none" });
  };

  const allMapPins = [
    ...customMemories.map((m) => ({
      id: m.id,
      lat: m.lat,
      lng: m.lng,
      pinType: "memory" as const,
      nodeType: m.nodeType || (m.id.includes("star") ? "star" : m.id.includes("bunny") ? "bunny" : "spidey"),
      title: m.title,
      createdAt: new Date().toISOString()
    })),
    { id: "mem0", lat: 11.2626, lng: 75.7746, pinType: "memory" as const, nodeType: "star" as const, title: "STAR MEMORY 🌟", createdAt: new Date().toISOString() },
    { id: "mem1", lat: 11.2540, lng: 75.7862, pinType: "memory" as const, nodeType: "bunny" as const, title: "BUNNY MEMORY 🐰", createdAt: new Date().toISOString() },
    { id: "mem2", lat: 11.2685, lng: 75.7830, pinType: "memory" as const, nodeType: "spidey" as const, title: "SPIDEY MEMORY 🕷️", createdAt: new Date().toISOString() },
  ].filter((p) => {
    if (p.nodeType === "star" && !starActive) return false;
    if (p.nodeType === "bunny" && !bunnyActive) return false;
    if (p.nodeType === "spidey" && !spideyActive) return false;
    return true;
  });

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#1c4c7c] p-2 sm:p-4">
      <APIProvider apiKey="AIzaSyDhFTe_7TYC4vcCSntJmbIVQcXTjjZuXcM" libraries={MAP_LIBRARIES} onError={(err) => console.error("Google Maps Error:", err)}>
        <main className="frame-3d-outer relative flex h-[calc(100dvh-16px)] sm:h-[calc(100dvh-32px)] max-h-[880px] w-full max-w-[430px] flex-col overflow-hidden bg-[#2c6c8c]">
          {/* FLOATING TOP OVERLAY BUTTONS OVERLAYING CONSOLE BORDER */}
          <div className="absolute inset-x-0 top-0 z-50 flex items-start justify-between p-1.5 pointer-events-none">
            {/* TOP LEFT LETTER BUTTON WITH 8-BIT STEPPED PIXEL CORNERS */}
            <button 
              onClick={openLetter} 
              className="btn-3d pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center"
              style={{ 
                "--btn-color": "#e6ad28", 
                "--bevel-light": "#ffe066", 
                "--bevel-dark": "#a37512" 
              } as any}
              aria-label="Open Birthday Letter"
            >
              <img src="/spidey-bday/assets/letter-transparent.png" alt="Letter" className="h-6 w-6 object-contain pixelated" />
            </button>

            {/* TOP CENTER PLAQUE */}
            <div className="pointer-events-auto flex flex-1 items-center justify-center px-1 pt-0.5">
              <img src="/spidey-bday/assets/plaque-transparent.png" alt="Spidey Tracker" className="h-12 w-auto max-w-[280px] object-contain pixelated drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]" />
            </div>

            {/* TOP RIGHT GREY SQUARE STAR BUTTON WITH 8-BIT STEPPED PIXEL CORNERS */}
            <button
              onClick={() => {
                sound.play("panel-open", 0.45);
                setActivePanel({ type: "add" });
              }}
              className="btn-3d pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center"
              style={{ 
                "--btn-color": "#c4c4c4", 
                "--bevel-light": "rgba(255,255,255,0.8)", 
                "--bevel-dark": "rgba(0,0,0,0.4)" 
              } as any}
              aria-label="Add Memory Node"
              title="Add Memory Node"
            >
              <img src="/spidey-bday/assets/star-transparent.png" alt="Star" className="h-6 w-6 object-contain pixelated" />
            </button>
          </div>

          {/* SIDEBAR TABS (STAR: #8F2867, BUNNY: #FFB5E6, SPIDEY: #b85c5c) */}
          {booted && (
            <div className="absolute left-0 top-1/3 z-50 flex -translate-y-1/2 flex-col gap-1.5">
              {/* STAR TAB */}
              {/* MANAV TAB (STAR: #8F2867) */}
              <button 
                onClick={() => {
                  sound.play("panel-open", 0.3);
                  setStarActive(!starActive);
                }} 
                aria-label="Toggle Manav's Nodes"
                title="Toggle Manav's Nodes (Star)"
                className="group relative flex h-[38px] w-[48px] cursor-pointer items-center justify-center transition-opacity active:scale-95"
              >
                <svg viewBox="0 0 58 46" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]" preserveAspectRatio="none">
                  <path d="M0,2 L44,2 L56,23 L44,44 L0,44" fill={starActive ? "#8F2867" : "#4a525d"} stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="miter" />
                  <path d="M0,6 L38,6 L48,23" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity={starActive ? "0.4" : "0.15"} />
                </svg>
                <img 
                  src="/spidey-bday/assets/symbol-star.png" 
                  alt="" 
                  className={`relative z-10 mr-1.5 h-5 w-5 object-contain pixelated transition-opacity ${starActive ? "opacity-100" : "opacity-40 grayscale"}`} 
                />
              </button>

              {/* FARHA TAB (BUNNY: #FFB5E6) */}
              <button 
                onClick={() => {
                  sound.play("panel-open", 0.3);
                  setBunnyActive(!bunnyActive);
                }} 
                aria-label="Toggle Farha's Nodes"
                title="Toggle Farha's Nodes (Bunny)"
                className="group relative flex h-[38px] w-[48px] cursor-pointer items-center justify-center transition-opacity active:scale-95"
              >
                <svg viewBox="0 0 58 46" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]" preserveAspectRatio="none">
                  <path d="M0,2 L44,2 L56,23 L44,44 L0,44" fill={bunnyActive ? "#FFB5E6" : "#4a525d"} stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="miter" />
                  <path d="M0,6 L38,6 L48,23" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity={bunnyActive ? "0.4" : "0.15"} />
                </svg>
                <img 
                  src="/spidey-bday/assets/symbol-bunny.png" 
                  alt="" 
                  className={`relative z-10 mr-1.5 h-5 w-5 object-contain pixelated transition-opacity ${bunnyActive ? "opacity-100" : "opacity-40 grayscale"}`} 
                />
              </button>

              {/* TWIN TAB (SPIDEY: #b85c5c) */}
              <button 
                onClick={() => {
                  sound.play("panel-open", 0.3);
                  setSpideyActive(!spideyActive);
                }} 
                aria-label="Toggle Twin's Nodes"
                title="Toggle Twin's Nodes (Spidey)"
                className="group relative flex h-[38px] w-[48px] cursor-pointer items-center justify-center transition-opacity active:scale-95"
              >
                <svg viewBox="0 0 58 46" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]" preserveAspectRatio="none">
                  <path d="M0,2 L44,2 L56,23 L44,44 L0,44" fill={spideyActive ? "#b85c5c" : "#4a525d"} stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="miter" />
                  <path d="M0,6 L38,6 L48,23" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity={spideyActive ? "0.4" : "0.15"} />
                </svg>
                <img 
                  src="/spidey-bday/assets/side-button-transparent.png" 
                  alt="" 
                  className={`relative z-10 mr-1.5 h-6 w-6 object-contain pixelated transition-opacity ${spideyActive ? "opacity-100" : "opacity-40 grayscale"}`} 
                />
              </button>
            </div>
          )}

        <div className="relative min-h-0 flex-1 px-3 pt-7 pb-1">
          <div className="frame-3d-screen relative h-full overflow-hidden bg-[#04040e]">
            <div className="scanlines pointer-events-none absolute inset-0 z-50" />
            
            <div className="absolute inset-0 overflow-hidden">
              {(stage === "live" || stage === "initmap") && (
                <TrackerMap
                  extraPins={allMapPins}
                  hiddenTypes={[]}
                  focusPinId={
                    activePanel.type === "memory" 
                      ? activePanel.id 
                        ? activePanel.id 
                        : `mem${activePanel.index}` 
                      : activePanel.type === "letter" 
                        ? "letter" 
                        : null
                  }
                  onPinFocus={(id) => {
                    if (!id) {
                      setActivePanel({ type: "none" });
                    } else if (id === "letter") {
                      setActivePanel({ type: "letter" });
                    } else if (id.startsWith("custom_")) {
                      setActivePanel({ type: "memory", id });
                    } else if (id.startsWith("mem")) {
                      setActivePanel({ type: "memory", index: parseInt(id.replace("mem", "")) });
                    }
                  }}
                />
              )}

              <div className="screen-depth" aria-hidden />

              {stage === "checking" && (
                <BootSequence 
                  onComplete={() => finishBoot(true)} 
                  onSelectSound={(enabled) => setMuted(!enabled)}
                />
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
            </div>
          </div>
        </div>

        {/* BOTTOM TICKER PANEL */}
        <div className="relative z-50 flex h-14 w-full shrink-0 items-center gap-2 border-t-4 border-black bg-transparent py-2 pr-2 pl-14">
          {/* OVERLAPPING SPIDEY AVATAR */}
          <div className="absolute -left-1 -bottom-1 z-50 flex h-16 w-14 items-center justify-center pointer-events-none">
            {/* SMALL BACKGROUND CIRCLE BADGE BEHIND SPIDEY */}
            <div className="absolute bottom-1 h-10 w-10 rounded-full border-[3px] border-[#0a0a0a] bg-[#5a9cba] shadow-[0_3px_8px_rgba(0,0,0,0.5)]" />
            {/* SPIDER-MAN CHARACTER PNG ON TOP (UNCOMPRESSED) */}
            <img 
              src="/spidey-bday/assets/spiderman-walk.png" 
              alt="" 
              className="relative z-10 h-16 w-auto object-contain pixelated drop-shadow-[0_2px_0_rgba(0,0,0,1)] animate-spidey-idle" 
            />
          </div>

          {/* SCROLLING TICKER PILL WITH 8-BIT STEPPED PIXEL CORNERS */}
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

          {/* SOUND TOGGLE PILL WITH 8-BIT STEPPED PIXEL CORNERS */}
          <button
            type="button"
            onClick={() => {
              const on = sound.toggle();
              setMuted(!on);
              setSoundPreference(on);
            }}
            className="btn-3d flex h-full w-12 shrink-0 cursor-pointer items-center justify-center pt-1"
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

        {/* TOPMOST OVERLAY MODALS (LETTER, MEMORY CARD, ADD MEMORY NODE) */}
        {activePanel.type === "memory" && (
          <MemoryModal 
            index={activePanel.index} 
            memoryId={activePanel.id}
            customMemories={customMemories}
            onClose={closePanel} 
          />
        )}
        {activePanel.type === "letter" && (
          <LetterModal onClose={closePanel} />
        )}
        {activePanel.type === "add" && (
          <AddMemoryModal 
            onClose={closePanel} 
            onSave={handleSaveMemory} 
          />
        )}
      </main>
      </APIProvider>
    </div>
  );
}
