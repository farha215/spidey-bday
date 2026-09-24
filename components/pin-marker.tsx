"use client";

import { useState } from "react";
import { PIN_COLORS, PIN_GLYPHS, type Pin } from "@/lib/tracker";

/**
 * Pixel pin. Tries the generated sprite at /sprites/pin-<type>.png first;
 * until sprites exist it falls back to a CSS 8-bit badge so the map never
 * looks broken. Swap happens automatically when the PNGs land in public/.
 */
export function PinMarker({ pin }: { pin: Pin }) {
	const [spriteMissing, setSpriteMissing] = useState(false);
	const color = PIN_COLORS[pin.pinType];

	return (
		<div
			className={`relative cursor-pointer transition-transform hover:scale-110 ${
				pin.highlighted ? "pin-highlighted" : ""
			}`}
			style={{ width: 42, height: 42 }}
			title={pin.title}
		>
			<span className="drop-wave" aria-hidden />
			<span className="drop-wave drop-wave--b" aria-hidden />
			<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]">
				<img
					src={pin.pinType === "letter" ? "/assets/spider-black.png" : "/assets/pin-spider.png"}
					alt=""
					className="pixelated h-full w-full object-cover"
					style={{ mixBlendMode: 'multiply' }}
				/>
			</div>
		</div>
	);
}
