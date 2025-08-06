import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";
import * as directives from "vuetify/directives";
import { VDateInput } from "vuetify/labs/VDateInput";

import PerfectScrollbar1 from "vue3-perfect-scrollbar";
import VueTablerIcons from "vue-tabler-icons";
import "@/scss/style.scss";
import { PurpleTheme } from "@/theme/LightTheme";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      ...labsComponents,
      VDateInput,
    },
    directives,

    theme: {
      defaultTheme: "PurpleTheme",
      themes: {
        PurpleTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
  app.vueApp.use(PerfectScrollbar1);
  app.vueApp.use(VueTablerIcons);
});
