import { beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

// Global test setup for Astro components
beforeAll(() => {
  // Mock global objects that might be needed
  global.window = global.window || {};
  global.document = global.document || {};
  
  // Set up any global mocks or configurations
  global.astroContainer = AstroContainer.create();
});

// Mock Astro's import.meta.env if needed
declare global {
  var astroContainer: any;
}

// Example: Mock Astro's import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: true,
    SITE: 'http://localhost:4321',
    BASE_URL: '/',
  },
  writable: true,
});

export {};