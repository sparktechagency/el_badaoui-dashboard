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
//   server: {
//     host: "10.10.7.62",
//     // port: 3003,
//   },
// });


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
});
