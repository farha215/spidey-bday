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
	description: "Spidey Memory Tracker - Interactive Birthday Map & Memories",
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
