import { router, addRoutes } from "./router/index";
import { getToken } from "./tools/cookieFunction";
import { messageInfo } from "./tools/messagePopup";
import store from "./store/index";
import { showLoading, unShowLoading } from "~/tools/loading";
//全局前置守卫
let hasGetInfo = false;
router.beforeEach(async (to, from, next) => {
  //显示loading
  showLoading();
  const token = getToken();
  //没有登录强制跳转回登录页
  if (!token && to.path != "/login") {
    messageInfo("请先登录", "error");
    return next({ path: "/login" });
  }

  //防止重复登录的判断
  if (token && to.path == "/login") {
    messageInfo("您已登录，请勿重复登录", "warning");
    return next({ path: from.path ? from.path : "/" });
  }
  let hasNewRoutes = false;
  //如果用户登录了并且hasGetInfo为false才调用getInfo 自动获取用户信息并存储在vuex中
  if (token && hasGetInfo == false) {
    // let res 是因为getInfo调用了reslove 通过reslove传回了一个res，再解构menus给addRoutes
    let { menus } = await store.dispatch("getInfo");
    hasGetInfo = true;
    //动态添加路由
    hasNewRoutes = addRoutes(menus);
  }

  //设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + "   ligos";
  document.title = title;
  hasNewRoutes ? next(to.fullPath) : next(); //有next的话必须放行
});

// 全局后置守卫
router.afterEach((to, from) => {
  unShowLoading();
});
