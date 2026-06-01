import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/Experiments/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          documents: ["docx"],
          markdown: ["react-markdown", "remark-gfm"],
        },
      },
    },
  },
}));
