import { getViteConfig } from "astro/config";
import type { UserConfig } from "vitest";

export default getViteConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    coverage: {
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "vitest.config.ts",
        "vitest.setup.ts",
      ]
    },
    // Transform Astro files
    transformMode: {
      web: [/\.[jt]sx?$/, /\.astro$/]
    }
  } as UserConfig,
});