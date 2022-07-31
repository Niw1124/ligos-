import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import { router } from "./router/index";
import store from "./store/index"; //引入状态管理
import "../node_modules/nprogress/nprogress.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
app.use(router);
app.use(store);
import permission from "./dirctives/permission";
app.use(permission);
import "./permission";

app.mount("#app");
