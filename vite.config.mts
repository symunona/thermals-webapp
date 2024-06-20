import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

import { Buffer as BufferPolyfill } from 'buffer'
declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill

export default defineConfig({
  //base: '/app/',
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  define: {
    global: {},
  },
  server: {
    // Show to everyone on the network
    host: '0.0.0.0',
    port: 3000,
    cors: {
      origin: "*",
      allowedHeaders: ["Access-Control-Allow-Origin", "Access-Control-Allow-Methods"]
    }
  },
  build: {
    target: 'esnext',
  },
});
