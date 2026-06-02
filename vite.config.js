import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/muju-furniture-store/",
  plugins: [react()],
});
