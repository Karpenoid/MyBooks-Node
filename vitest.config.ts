import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      JWT_SECRET: "secret_key_for_tests",
    },
  },
});