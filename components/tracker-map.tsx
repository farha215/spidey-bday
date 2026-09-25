"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PinCard } from "@/components/pin-card";
import { PinMarker } from "@/components/pin-marker";
import { Radar } from "@/components/radar";
import { sound } from "@/lib/sound";
import { getPins, type Pin, type PinType } from "@/lib/tracker";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

const PINS = getPins();

export function TrackerMap({
	extraPins = [],
	hiddenTypes = [],
	focusPinId = null,
	onPinFocus,
}: {
	extraPins?: Pin[];
	hiddenTypes?: PinType[];
	focusPinId?: string | null;
	onPinFocus?: (id: string | null) => void;
}) {
	const map = useMap();
	const [selected, setSelected] = useState<Pin | null>(null);
	const deepLinkedRef = useRef<string | null>(null);
	const [toastMsg, setToastMsg] = useState<string | null>(null);
	const toastTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleToast = useCallback((msg: string) => {
		setToastMsg(msg);
		if (toastTimeout.current) clearTimeout(toastTimeout.current);
		toastTimeout.current = setTimeout(() => setToastMsg(null), 2500);
	}, []);

	const allPins = [...PINS, ...extraPins].filter(
		(p) => p.lat != null && p.lng != null,
	);
	const visiblePins = allPins.filter((p) => !hiddenTypes.includes(p.pinType));

	const [clusterModalPins, setClusterModalPins] = useState<Pin[] | null>(null);

	// Group overlapping pins within 0.0005 lat/lng threshold
	const clusters: { key: string; lat: number; lng: number; pins: Pin[] }[] = [];
	const THRESHOLD = 0.0005;

	visiblePins.forEach((pin) => {
		const existing = clusters.find(
			(c) =>
				Math.abs(c.lat - (pin.lat as number)) < THRESHOLD &&
				Math.abs(c.lng - (pin.lng as number)) < THRESHOLD,
		);
		if (existing) {
			existing.pins.push(pin);
		} else {
			clusters.push({
				key: pin.id,
				lat: pin.lat as number,
				lng: pin.lng as number,
				pins: [pin],
			});
		}
	});

	const flyToPin = useCallback(
		(pin: Pin, opts?: { silent?: boolean }) => {
			if (map && pin.lat != null && pin.lng != null) {
				map.panTo({ lat: pin.lat, lng: pin.lng });
				map.setZoom(10.8);
			}
			setSelected(null);
			setClusterModalPins(null);
			onPinFocus?.(pin.id);
			deepLinkedRef.current = pin.id;
			
			if (!opts?.silent) {
				sound.play("pin-click", 0.5);
			}
		},
		[map, onPinFocus],
	);

	useEffect(() => {
		if (!focusPinId || deepLinkedRef.current === focusPinId) return;
		const pin = allPins.find((p) => p.id === focusPinId);
		if (pin) flyToPin(pin, { silent: true });
	}, [focusPinId, allPins, flyToPin]);

	useEffect(() => {
		const onFly = (e: Event) => {
			const pin = (e as CustomEvent<{ pin: Pin }>).detail?.pin;
			if (pin) flyToPin(pin);
		};
		document.addEventListener("app:fly-to-pin", onFly);
		return () => document.removeEventListener("app:fly-to-pin", onFly);
	}, [flyToPin]);

	const closePin = useCallback(() => {
		setSelected(null);
		deepLinkedRef.current = null;
		onPinFocus?.(null);
	}, [onPinFocus]);

	return (
		<div className="relative h-full w-full">
			<Map
				mapId="a02018de0f67e69b12e6719b"
				defaultCenter={{ lat: -14, lng: -67 }}
				defaultZoom={2.5}
				disableDefaultUI={true}
				gestureHandling="greedy"
				colorScheme={"DARK" as any}
				backgroundColor="#030405"
				className="h-full w-full"
				minZoom={2.2}
				restriction={{
					latLngBounds: {
						north: 85,
						south: -85,
						west: -360,
						east: 360,
					},
					strictBounds: true,
				}}
			>
				{clusters.map((cluster) => {
					if (cluster.pins.length === 1) {
						const pin = cluster.pins[0];
						return (
							<AdvancedMarker
								key={pin.id}
								position={{ lat: cluster.lat, lng: cluster.lng }}
								onClick={() => flyToPin(pin)}
							>
								<PinMarker pin={pin} />
							</AdvancedMarker>
						);
					}

					return (
						<AdvancedMarker
							key={cluster.key}
							position={{ lat: cluster.lat, lng: cluster.lng }}
							onClick={() => {
								sound.play("pin-click", 0.5);
								setClusterModalPins(cluster.pins);
							}}
						>
							<div className="relative flex cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95">
								<div className="flex items-center gap-1 border-2 border-black bg-[#e6ad28] px-2 py-1 shadow-[0_4px_10px_rgba(0,0,0,0.8)] font-pixel-body text-[9px] font-bold text-black">
									<span>📍</span>
									<span>{cluster.pins.length} NODES</span>
								</div>
							</div>
						</AdvancedMarker>
					);
				})}
			</Map>

			<div className="graticule absolute inset-0 z-[5]" aria-hidden />

			<Radar map={map} pins={visiblePins} onToast={handleToast} />

			{toastMsg && (
				<div className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2">
					<div className="border-[2px] border-[#96e0f7] bg-[#0a0a0a]/80 px-4 py-2 font-pixel-body text-[10px] tracking-wider text-[#96e0f7] backdrop-blur-sm whitespace-nowrap">
						{toastMsg}
					</div>
				</div>
			)}

			{/* MULTI-NODE CLUSTER SELECTION MODAL */}
			{clusterModalPins && (
				<div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] font-pixel-body select-none">
					<div 
						className="bit-border relative z-10 w-full max-w-xs p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] flex flex-col gap-3"
						style={{ 
							"--bb-step": "4px", 
							"--bb-frame": "#000000", 
							"--bb-fill": "#ded6be" 
						} as any}
					>
						<div className="flex items-center justify-between border-b-2 border-black/10 pb-1">
							<div className="bg-[#e6ad28] px-2 py-0.5 text-black font-pixel-body text-[9px] font-bold tracking-wider">
								📍 {clusterModalPins.length} NODES AT LOCATION
							</div>
							<button
								type="button"
								onClick={() => setClusterModalPins(null)}
								className="flex h-5 w-5 items-center justify-center font-bold text-black hover:bg-black/10 rounded"
							>
								✕
							</button>
						</div>

						<p className="text-[8px] text-[#2a241e] font-bold">
							SELECT A MEMORY TO VIEW:
						</p>

						<div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
							{clusterModalPins.map((pin) => {
								const nType = (pin as any).nodeType || "spidey";
								const icon = nType === "star" ? "⭐" : nType === "bunny" ? "🐰" : nType === "mona" ? "🦭" : "🕷️";
								return (
									<button
										key={pin.id}
										type="button"
										onClick={() => flyToPin(pin)}
										className="border-2 border-black bg-white p-2 text-left hover:bg-[#96e0f7]/20 active:translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
									>
										<div className="flex flex-col gap-0.5 overflow-hidden pr-2">
											<div className="text-[9px] font-bold text-black truncate flex items-center gap-1">
												<span>{icon}</span>
												<span>{pin.title}</span>
											</div>
											{pin.displayLocation && (
												<div className="text-[7.5px] text-[#555] truncate">
													📍 {pin.displayLocation}
												</div>
											)}
										</div>
										<span className="bg-[#2d7d54] text-white px-2 py-0.5 text-[8px] font-bold shrink-0">
											SELECT
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{selected && (
				<div className="card-pop absolute left-1/2 top-4 z-20 -translate-x-1/2">
					<PinCard pin={selected} onClose={closePin} />
				</div>
			)}
		</div>
	);
}
