import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; //1的新建文件
import ElementUI from "element-ui";

import "./assets/element-variables.scss";
// import element-tiptap 样式
import "./util/flexible";

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
