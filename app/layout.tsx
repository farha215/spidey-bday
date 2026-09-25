import type { Metadata } from "next";
import { Bitcount_Prop_Single } from "next/font/google";
import "./globals.css";

const pixelTitle = Bitcount_Prop_Single({
	variable: "--font-pixel",
	subsets: ["latin"],
});

const pixelBody = Bitcount_Prop_Single({
	variable: "--font-pixel-body",
	subsets: ["latin"],
	weight: "400",
});

export const metadata: Metadata = {
	title: "Spidey Tracker 🕷️",
	description: "Interactive Spidey Memory Tracker & World Map",
	openGraph: {
		title: "Spidey Tracker 🕷️",
		description: "Interactive Spidey Memory Tracker & World Map",
		url: "https://farha215.github.io/spidey-bday",
		siteName: "Spidey Tracker",
		images: [
			{
				url: "https://farha215.github.io/spidey-bday/assets/symbol-transparent.png",
				width: 1200,
				height: 630,
				alt: "Spidey Tracker Emblem",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Spidey Tracker 🕷️",
		description: "Interactive Spidey Memory Tracker & World Map",
		images: ["https://farha215.github.io/spidey-bday/assets/symbol-transparent.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`dark ${pixelTitle.variable} ${pixelBody.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5e9c8]">
				{children}
			</body>
		</html>
	);
}
