"use client";

import React, { useState, useEffect } from "react";
import type { Memory } from "@/components/memory-modal";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function AddMemoryModal({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void; 
  onSave: (mem: Memory) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [lat, setLat] = useState("11.2588");
  const [lng, setLng] = useState("75.7810");
  const [nodeType, setNodeType] = useState<"star" | "bunny" | "spidey" | "mona">("star");

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>("");

  useEffect(() => {
    if (!location.trim() || location.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=5`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSearchResults(data);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error("Geocoding fetch error", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  const selectResult = (result: SearchResult) => {
    const parts = result.display_name.split(",");
    const shortName = parts.slice(0, 2).join(",").trim();
    setLocation(shortName);
    setLat(parseFloat(result.lat).toFixed(4));
    setLng(parseFloat(result.lon).toFixed(4));
    setShowDropdown(false);
    setSearchStatus("📍 LOCATION PINPOINTED!");
    setTimeout(() => setSearchStatus(""), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const rawData = reader.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setPhoto(canvas.toDataURL("image/jpeg", 0.7));
          } else {
            setPhoto(rawData);
          }
        };
        img.onerror = () => setPhoto(rawData);
        img.src = rawData;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const defaultPhoto = nodeType === "star" 
      ? "/spidey-bday/assets/symbol-star.png" 
      : nodeType === "bunny" 
        ? "/spidey-bday/assets/symbol-bunny.png" 
        : nodeType === "mona"
          ? "/spidey-bday/assets/seal.png"
          : "/spidey-bday/assets/spidey-face-transparent.png";

    const newMem: Memory = {
      id: `custom_${nodeType}_${Date.now()}`,
      title: title.trim(),
      location: location.trim() || "Secret Spot",
      date: date.trim() || new Date().toLocaleDateString(),
      caption: caption.trim(),
      photo: photo || defaultPhoto,
      lat: parseFloat(lat) || 11.2588,
      lng: parseFloat(lng) || 75.7810,
      nodeType: nodeType,
    };

    onSave(newMem);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />

      {/* 8-Bit Pixel Stepped Card */}
      <div 
        className="bit-border relative z-10 w-full max-w-sm p-4 font-pixel-body shadow-[6px_6px_0px_rgba(0,0,0,0.8)] pointer-events-auto" 
        style={{ 
          "--bb-step": "4px", 
          "--bb-frame": "#000000", 
          "--bb-fill": "#ded6be" 
        } as any}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black/10 pb-1">
            <div className="bg-[#5a9cba] px-2 py-0.5 text-white font-pixel-body text-[9px] tracking-wider font-bold">
              + NEW MEMORY NODE
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-pixel-body text-xs font-bold text-black hover:bg-black/10"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 font-pixel-body text-[8px] text-[#2a241e]">
            {/* NODE TYPE SELECTOR */}
            <div>
              <label className="block font-bold text-black mb-1">NODE SYMBOL & COLOR</label>
              <div className="grid grid-cols-2 gap-1.5 p-1">
                <button
                  type="button"
                  onClick={() => setNodeType("star")}
                  className={`btn-3d flex items-center justify-center gap-1.5 py-1.5 px-2 font-pixel-body font-bold text-white cursor-pointer transition-all ${
                    nodeType === "star" 
                      ? "scale-105" 
                      : "opacity-60 grayscale-[40%] hover:opacity-100"
                  }`}
                  style={{ 
                    "--btn-color": "#8F2867", 
                    "--bevel-light": "#d64da0", 
                    "--bevel-dark": "#4a1235" 
                  } as any}
                >
                  <img src="/spidey-bday/assets/symbol-star.png" alt="" className="h-4 w-4 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" />
                  <span className="text-[8px] tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">MANAV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNodeType("bunny")}
                  className={`btn-3d flex items-center justify-center gap-1.5 py-1.5 px-2 font-pixel-body font-bold text-black cursor-pointer transition-all ${
                    nodeType === "bunny" 
                      ? "scale-105" 
                      : "opacity-60 grayscale-[40%] hover:opacity-100"
                  }`}
                  style={{ 
                    "--btn-color": "#FFB5E6", 
                    "--bevel-light": "#ffffff", 
                    "--bevel-dark": "#b870a2" 
                  } as any}
                >
                  <img src="/spidey-bday/assets/symbol-bunny.png" alt="" className="h-4 w-4 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]" />
                  <span className="text-[8px] tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">FARHA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNodeType("spidey")}
                  className={`btn-3d flex items-center justify-center gap-1.5 py-1.5 px-2 font-pixel-body font-bold text-white cursor-pointer transition-all ${
                    nodeType === "spidey" 
                      ? "scale-105" 
                      : "opacity-60 grayscale-[40%] hover:opacity-100"
                  }`}
                  style={{ 
                    "--btn-color": "#b85c5c", 
                    "--bevel-light": "#e08585", 
                    "--bevel-dark": "#632727" 
                  } as any}
                >
                  <img src="/spidey-bday/assets/pin-spider-transparent.png" alt="" className="h-4 w-4 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" />
                  <span className="text-[8px] tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">TWIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNodeType("mona")}
                  className={`btn-3d flex items-center justify-center gap-1.5 py-1.5 px-2 font-pixel-body font-bold text-black cursor-pointer transition-all ${
                    nodeType === "mona" 
                      ? "scale-105" 
                      : "opacity-60 grayscale-[40%] hover:opacity-100"
                  }`}
                  style={{ 
                    "--btn-color": "#E5FAFF", 
                    "--bevel-light": "#ffffff", 
                    "--bevel-dark": "#9ec5d0" 
                  } as any}
                >
                  <img src="/spidey-bday/assets/seal.png" alt="" className="h-4 w-4 object-contain pixelated drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]" />
                  <span className="text-[8px] tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">MONA</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-black mb-0.5">MEMORY TITLE</label>
              <input 
                type="text" 
                placeholder="" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-black bg-white px-2 py-1 font-pixel-body text-[9px] text-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 relative">
              <div className="relative">
                <label className="block font-bold text-black mb-0.5">LOCATION (SEARCH MAP)</label>
                <input 
                  type="text" 
                  placeholder="🔍 Type location..." 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  className="w-full border-2 border-black bg-white px-2 py-1 font-pixel-body text-[8px] text-black focus:outline-none"
                />
                {isSearching && (
                  <div className="absolute right-2 top-6 text-[7px] text-black animate-pulse">
                    ...
                  </div>
                )}

                {/* DROPDOWN RESULTS */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-36 overflow-y-auto border-2 border-black bg-[#ded6be] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectResult(res)}
                        className="w-full border-b border-black/20 p-1.5 text-left text-[7.5px] text-black hover:bg-[#5a9cba] hover:text-white transition-colors cursor-pointer"
                      >
                        📍 {res.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-bold text-black mb-0.5">DATE</label>
                <input 
                  type="text" 
                  placeholder="e.g. OCT 12, 2024" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-black bg-white px-2 py-1 font-pixel-body text-[8px] text-black focus:outline-none"
                />
              </div>
            </div>

            {searchStatus && (
              <div className="text-[7px] font-bold text-[#2d7d54] tracking-wider animate-pulse">
                {searchStatus}
              </div>
            )}

            <div>
              <label className="block font-bold text-black mb-0.5">PHOTO</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-[7px] text-black file:mr-2 file:cursor-pointer file:border-2 file:border-black file:bg-[#5a9cba] file:px-2 file:py-0.5 file:font-pixel-body file:text-[7px] file:text-white"
              />
              {photo && (
                <div className="mt-1.5 h-16 w-full overflow-hidden border-2 border-black bg-black">
                  <img src={photo} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-black mb-0.5">STORY / CAPTION</label>
              <textarea 
                rows={2}
                placeholder="" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border-2 border-black bg-white px-2 py-1 font-pixel-body text-[8px] text-black focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 border-2 border-black bg-[#2d7d54] py-1.5 font-pixel-body text-[9px] font-bold text-white shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-[#369665] active:translate-y-0.5 cursor-pointer"
            >
              SAVE MEMORY NODE 🕷
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
