import { defineConfig } from 'vitest/config';

// Port 5180: 5173 = EvoSim, 5174 = evosim-qwen
export default defineConfig({
  base: './',
  server: { port: 5180, strictPort: true, allowedHosts: ['pbsnuk.tail96d364.ts.net'] },
  test: { include: ['test/**/*.test.ts'] },
});
