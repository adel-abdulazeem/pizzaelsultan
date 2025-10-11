// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import playformInline from "@playform/inline";
import mdx from "@astrojs/mdx";
import image from "@astrojs/image";

export default defineConfig({

	site: "https://chosen-restaurant.netlify.app/",
	base: "/",
	integrations: [
		image(),
		alpinejs(),
		playformInline({
			Beasties: true,
		}),
		mdx(),
	],
	output: "static",
	devToolbar: {
		enabled: false,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
