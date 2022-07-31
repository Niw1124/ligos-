import { createStore } from "vuex";
import { getInfo, login } from "~/api/manager";
import { setToken, removeToken } from "~/tools/cookieFunction";

const store = createStore({
  state() {
    return {
      //用户信息
      user: {},
      //侧边宽度
      asideWidth: "250px",

      menus: [],
      ruleNames: [],
    };
  },
  mutations: {
    //记录用户信息
    SET_USERINFO(state, user) {
      //将SET_USERINFO传进来的user传给state里的user
      state.user = user;
    },
    //展开或者是缩起侧边
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    //登录
    // login(username, password) {
    //   return axios.post("/admin/login", { username, password });
    // }
    login({ commit }, { username, password }) {
      return new Promise((reslove, reject) => {
        login(username, password)
          .then((res) => {
            setToken(res.token);
            reslove(res);
          })
          .catch((err) => reject(err));
      });
    },
    //获取当前登录用户信息
    getInfo({ commit }) {
      //解构后直接可以使用commit 而不是state.commit
      //提交给SET_USERINFO后 SET_USERINFO给state.user赋值
      return new Promise((reslove, reject) => {
        getInfo()
          .then((res) => {
            commit("SET_USERINFO", res);
            commit("SET_MENUS", res.menus);
            commit("SET_RULENAMES", res.ruleNames);
            reslove(res);
          })
          .catch((err) => reject(err));
      });
    },
    //退出登录
    logOut({ commit }) {
      //移除cookie里的token
      removeToken();
      //清除当前用户状态vuex
      commit("SET_USERINFO", {});
    },
    //修改密码
    rePassword({ commit }) {
      removeToken();
      //清除当前用户状态vuex
      commit("SET_USERINFO", {});
    },
  },
});

export default store;
