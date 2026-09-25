"use client";

/**
 * Sound manager: HTMLAudio pool, global toggle, background music loop,
 * voice lines organized by category with click throttle and no-repeat tracking.
 */

const BASE_PATH = "/spidey-bday";

function getSrc(path: string): string {
	if (typeof window === "undefined") return path;
	if (path.startsWith(BASE_PATH)) return path;
	return `${BASE_PATH}${path.startsWith("/") ? "" : "/"}${path}`;
}

const VOICE_BY_CATEGORY: Record<string, string[]> = {
	welcome: ["welcome"],
	general: ["explore", "keep-shipping", "radar-online"],
	shipped: ["ship-spotted"],
	cooking: ["cooking"],
	event: ["event-near"],
	villain: ["scope-creep"],
};

const THROTTLE_EVERY = 3;

let enabled = false;
let clickCount = 0;
const tracks = new Map<string, HTMLAudioElement>();
const played = new Set<string>();
let currentVoice: HTMLAudioElement | null = null;
let bgMusic: HTMLAudioElement | null = null;

function track(src: string): HTMLAudioElement {
	const fullSrc = getSrc(src);
	let a = tracks.get(fullSrc);
	if (!a) {
		a = new Audio(fullSrc);
		a.preload = "auto";
		tracks.set(fullSrc, a);
	}
	return a;
}

export const sound = {
	enable() {
		enabled = true;
		sound.startBgm();
	},
	disable() {
		enabled = false;
		sound.stopBgm();
		for (const a of tracks.values()) {
			a.pause();
			a.currentTime = 0;
		}
	},
	isEnabled() {
		return enabled;
	},
	toggle() {
		if (enabled) sound.disable();
		else sound.enable();
		return enabled;
	},
	startBgm() {
		if (!enabled) return;
		try {
			if (!bgMusic) {
				bgMusic = new Audio(getSrc("/sounds/oh-yeah.mp3"));
				bgMusic.loop = true;
				bgMusic.volume = 0.5;
			}
			bgMusic.play().catch(() => {});
		} catch (err) {}
	},
	stopBgm() {
		if (bgMusic) {
			bgMusic.pause();
			bgMusic.currentTime = 0;
		}
	},

	/** UI sfx from /sounds/<name>.mp3 */
	play(name: string, volume = 0.6) {
		if (!enabled) return;
		const a = track(`/sounds/${name}.mp3`);
		a.volume = volume;
		a.currentTime = 0;
		a.play().catch(() => {});
	},

	/** Voice line by category - disabled so no template voice clips overlap your music */
	say(_category: keyof typeof VOICE_BY_CATEGORY) {
		// Disabled: prevents template Spanish voice line overlaps
	},

	/** Per-villain line - disabled */
	sayVillainById(_id: string) {
		// Disabled: prevents template Spanish voice line overlaps
	},

	/** Stop the active voice line. */
	stopVoice() {
		if (!currentVoice) return;
		currentVoice.pause();
		currentVoice.currentTime = 0;
		currentVoice = null;
	},
};
