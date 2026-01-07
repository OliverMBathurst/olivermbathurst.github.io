import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
	base: "./",
	plugins: [react()],
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ["legacy-js-api"]
			}
		}
	}
})
