import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite"; // nitro import

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: "vercel", // forces Nitro to build Vercel Serverless Functions
    }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
    },
  },
});
