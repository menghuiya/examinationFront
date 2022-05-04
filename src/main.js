import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; //1的新建文件
import ElementUI from "element-ui";

import "./assets/element-variables.scss";
// import element-tiptap 样式
import "./util/flexible";

//导入代码高亮文件
// import hljs from "highlight.js";
//导入代码高亮样式
import "highlight.js/styles/monokai-sublime.css";
//自定义一个代码高亮指令
Vue.directive("highlight", function (el) {
  let highlight = el.querySelectorAll("pre code");
  highlight.forEach((block) => {
    // eslint-disable-next-line no-undef
    hljs.highlightBlock(block);
  });
});

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
