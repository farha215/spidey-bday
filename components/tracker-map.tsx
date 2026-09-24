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
				className="h-full w-full"
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

			<Radar map={map} pins={visiblePins} />

			{selected && (
				<div className="card-pop absolute left-1/2 top-4 z-20 -translate-x-1/2">
					<PinCard pin={selected} onClose={closePin} />
				</div>
			)}
		</div>
	);
}
