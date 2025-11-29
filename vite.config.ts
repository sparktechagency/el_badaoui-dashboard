import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});


// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import { resolve } from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": resolve(__dirname, "src"),
//     },
//   },
// });
