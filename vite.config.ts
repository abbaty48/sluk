import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: ["library-repository-3vai.onrender.com"],
    port: process.env.PORT ? Number(process.env.PORT) : 3500,
    proxy: {
      "/api": {
        secure: false,
        changeOrigin: true,
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-player", "i18next", "react-i18next"],
  },
  build: {
    target: "es2020",
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
