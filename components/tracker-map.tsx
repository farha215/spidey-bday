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

	const flyToPin = useCallback(
		(pin: Pin, opts?: { silent?: boolean }) => {
			if (!map || pin.lat == null || pin.lng == null) {
				setSelected(pin);
				onPinFocus?.(pin.id);
				deepLinkedRef.current = pin.id;
				return;
			}
			
			map.panTo({ lat: pin.lat, lng: pin.lng });
			map.setZoom(10.8);
			
			setSelected(pin);
			onPinFocus?.(pin.id);
			deepLinkedRef.current = pin.id;
			
			if (!opts?.silent) {
				sound.play("pin-click", 0.5);
				const cat =
					pin.pinType === "shipped"
						? "shipped"
						: pin.pinType === "cooking"
							? "cooking"
							: pin.pinType === "event" || pin.pinType === "hack0"
								? "event"
								: "general";
				sound.say(cat);
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
				{visiblePins.map((pin) => (
					<AdvancedMarker
						key={pin.id}
						position={{ lat: pin.lat as number, lng: pin.lng as number }}
						onClick={() => flyToPin(pin)}
					>
						<PinMarker pin={pin} />
					</AdvancedMarker>
				))}
			</Map>

			<div className="graticule absolute inset-0 z-[5]" aria-hidden />

			<Radar map={map} pins={visiblePins} onToast={handleToast} />

			{toastMsg && (
				<div className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2">
					<div className="border-[2px] border-[#96e0f7] bg-[#0a0a0a]/80 px-4 py-2 font-pixel-body text-[10px] tracking-wider text-[#96e0f7] backdrop-blur-sm">
						{toastMsg}
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
