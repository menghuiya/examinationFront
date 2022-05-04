import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userLogin: localStorage.getItem("userLogin"),
    userLoginData: JSON.parse(localStorage.getItem("userInfo") || "{}"),
  },
  mutations: {
    setUser(state, payload) {
      state.userLoginData = payload;
      state.userLogin = true;
      localStorage.setItem("userInfo", JSON.stringify(payload));
      localStorage.setItem("userLogin", true);
    },
    deleteUser(state) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userLogin");
      state.userLoginData = null;
      state.userLogin = false;
    },
  },
  actions: {},
  modules: {},
  getters: {
    isLogin(state) {
      return state.userLogin;
    },
  },
});
