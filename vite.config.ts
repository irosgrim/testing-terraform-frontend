import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), EnvironmentPlugin("all", { prefix: "REACT_APP_" })],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    build: {
        outDir: "dist",
        chunkSizeWarningLimit: 100,
    },
    define: {
        "process.env": {},
    },
});
