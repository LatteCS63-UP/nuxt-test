// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        baseUrl: ".",
      },
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [tailwindcss()],
  },
  hooks: {},
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        if (config.plugins) {
          config.plugins.push(vuetify({ autoImport: true }));
        }
      });
    },
  ],
  css: ["@progress/kendo-theme-default/dist/all.css", "~/assets/css/main.css"],
  spaLoadingTemplate: "loading-template.html",

  components: true,
  compatibilityDate: "2025-07-15",
});
