"use client";

import { useEffect, useRef } from "react";

import { PIN_COLORS, type Pin } from "@/lib/tracker";

const SIZE = 110;

function haversineKm(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) ** 2;
	return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const y = Math.sin(dLng) * Math.cos((lat2 * Math.PI) / 180);
	const x =
		Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
		Math.sin((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.cos(dLng);
	return Math.atan2(y, x);
}

/**
 * Web-radar in the map corner (Sony's Radar.js, reimplemented): a sweeping
 * cone over a spiderweb grid; blips are pins within range of the current
 * map center, placed by bearing + non-linear distance.
 */
export function Radar({
	map,
	pins,
	decorative = false,
	onToast,
}: {
	map: google.maps.Map | null;
	pins: Pin[];
	decorative?: boolean;
	onToast?: (msg: string) => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const panAnimRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (panAnimRef.current) cancelAnimationFrame(panAnimRef.current);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = SIZE * dpr;
		canvas.height = SIZE * dpr;
		ctx.scale(dpr, dpr);

		const cx = SIZE / 2;
		const cy = SIZE / 2;
		const R = SIZE / 2 - 2;
		let sweep = 0;
		let raf = 0;

		const drawPolygonPath = (r: number) => {
			const spokes = 10;
			ctx.beginPath();
			for (let i = 0; i <= spokes; i++) {
				const a = (i / spokes) * Math.PI * 2;
				const x = cx + r * Math.cos(a);
				const y = cy + r * Math.sin(a);
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
		};

		const drawWeb = () => {
			ctx.strokeStyle = "rgba(150, 224, 247, 0.4)";
			ctx.lineWidth = 1;
			const spokes = 10;
			for (let i = 0; i < spokes; i++) {
				const a = (i / spokes) * Math.PI * 2;
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
				ctx.stroke();
			}
			for (let ring = 1; ring <= 4; ring++) {
				drawPolygonPath((ring / 4) * R);
				ctx.stroke();
			}
		};

		const frame = () => {
			ctx.clearRect(0, 0, SIZE, SIZE);

			ctx.save();
			drawPolygonPath(R);
			ctx.clip();

			ctx.fillStyle = "#0a0a0a";
			ctx.fillRect(0, 0, SIZE, SIZE);
			drawWeb();

			// sweep cone
			const tail = Math.PI * 0.55;
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.arc(cx, cy, R, sweep - tail, sweep);
			ctx.closePath();
			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
			grad.addColorStop(0, "rgba(150, 224, 247, 0)");
			grad.addColorStop(1, "rgba(150, 224, 247, 0.35)");
			ctx.fillStyle = grad;
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.lineTo(cx + R * Math.cos(sweep), cy + R * Math.sin(sweep));
			ctx.strokeStyle = "#96e0f7";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			// blips relative to current map center
			if (map) {
				const center = map.getCenter();
				if (center) {
					const c = { lat: center.lat(), lng: center.lng() };
					const zoom = map.getZoom() ?? 3;
					const rangeKm = Math.max(300, 24000 / 2 ** (zoom - 1.5));
					for (const p of pins) {
						if (p.lat == null || p.lng == null) continue;
						const d = haversineKm(c.lat, c.lng, p.lat, p.lng);
						if (d > rangeKm) continue;
						const ang = bearing(c.lat, c.lng, p.lat, p.lng) - Math.PI / 2;
					const rr = R * (d / rangeKm) ** 0.82;
					ctx.beginPath();
					ctx.arc(
						cx + rr * Math.cos(ang),
						cy + rr * Math.sin(ang),
						2,
						0,
						Math.PI * 2,
					);
					ctx.fillStyle = PIN_COLORS[p.pinType] ?? "#96e0f7";
					ctx.fill();
				}
				}
			}

			ctx.restore();

			// rim
			drawPolygonPath(R);
			ctx.strokeStyle = "#96e0f7";
			ctx.lineWidth = 2;
			ctx.stroke();

			sweep = (sweep + 0.018) % (Math.PI * 2);
			raf = requestAnimationFrame(frame);
		};

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [map, pins]);

	return (
		<div className="pointer-events-auto absolute bottom-9 right-4 z-10">
			<canvas
				ref={canvasRef}
				style={{ width: SIZE, height: SIZE }}
				aria-label="Radar de actividad"
			/>
			{!decorative && (
				<div className="absolute -right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2">
					<button
						type="button"
						aria-label="Vista global"
						onClick={() => {
							if (map) {
								map.panTo({ lat: -14, lng: -67 });
								map.setZoom(2);
								onToast?.("centering to global view");
							}
						}}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a9cba] bg-[#0a0a0a]/80 text-[#96e0f7] backdrop-blur-sm transition-all hover:bg-[#5a9cba]/40 hover:scale-105 active:scale-95 shadow-md"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
					</button>
					<button
						type="button"
						aria-label="Centrar"
						onClick={() => {
							if (map) {
								if (panAnimRef.current) {
									cancelAnimationFrame(panAnimRef.current);
									panAnimRef.current = null;
								}
								onToast?.("centering to your neighborhood");
								const startCenter = map.getCenter();
								if (!startCenter) {
									map.panTo({ lat: 20.5937, lng: 78.9629 });
									map.setZoom(5);
									return;
								}
								const startLat = startCenter.lat();
								const startLng = startCenter.lng();
								const targetLat = 20.5937;
								const targetLng = 78.9629;
								const startZoom = map.getZoom() ?? 3;
								const targetZoom = 5;
								let dLng = targetLng - startLng;
								if (dLng > 180) dLng -= 360;
								if (dLng < -180) dLng += 360;
								const duration = 2800;
								let startTime: number | null = null;

								const animatePan = (currentTime: number) => {
									if (!startTime) startTime = currentTime;
									const elapsed = currentTime - startTime;
									const progress = Math.min(elapsed / duration, 1);
									// Smooth ease-in-out cubic curve
									const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

									const curLat = startLat + (targetLat - startLat) * ease;
									const curLng = startLng + dLng * ease;

									map.setCenter({ lat: curLat, lng: curLng });

									// Defer zoom transition to second half of glide for smooth 60fps start
									if (progress >= 0.4) {
										const zProg = (progress - 0.4) / 0.6;
										const zEase = zProg < 0.5 ? 2 * zProg * zProg : 1 - Math.pow(-2 * zProg + 2, 2) / 2;
										const curZoom = startZoom + (targetZoom - startZoom) * zEase;
										map.setZoom(curZoom);
									}

									if (progress < 1) {
										panAnimRef.current = requestAnimationFrame(animatePan);
									} else {
										panAnimRef.current = null;
									}
								};

								panAnimRef.current = requestAnimationFrame(animatePan);
							}
						}}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a9cba] bg-[#0a0a0a]/80 text-[#96e0f7] backdrop-blur-sm transition-all hover:bg-[#5a9cba]/40 hover:scale-105 active:scale-95 shadow-md"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="20" y2="12"/></svg>
					</button>
				</div>
			)}
		</div>
	);
}
