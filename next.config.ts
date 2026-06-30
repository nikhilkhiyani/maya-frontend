import type { NextConfig } from "next";
import path from "path";

function getBackendImagePattern() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const parsed = new URL(apiUrl);
    const pattern: {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    } = {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      pathname: "/uploads/**",
    };

    if (parsed.port) {
      pattern.port = parsed.port;
    }

    return pattern;
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "8080",
      pathname: "/uploads/**",
    };
  }
}

const nextConfig: NextConfig = {
  output: "standalone",

  turbopack: {
    root: path.join(__dirname),
  },

  images: {
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      getBackendImagePattern(),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
