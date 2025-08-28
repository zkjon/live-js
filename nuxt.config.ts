import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  alias: {
    "~": path.resolve("./"),
  },
  modules: ["@nuxtjs/google-fonts", "@vueuse/nuxt"],

  googleFonts: {
    families: {
      "Fira Code": [400, 500, 600],
      Inter: [400, 500, 600, 700],
    },
    display: "swap",
  },

  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "Live JS Coding",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Minimalist platform for writing and executing JavaScript code in real time",
        },
      ],
    },
  },
});
