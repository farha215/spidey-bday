import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/spidey-bday",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
