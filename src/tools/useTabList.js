import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
import { router } from "~/router/index.js";

export function useTabList() {
  const cookie = useCookies();
  const route = useRoute();
  //将route的path变成响应式  这样选中的标签就与当前路径相对应起来  刷新之后也会对应
  const activeTab = ref(route.path);
  const tablist = ref([
    {
      title: "后台首页",
      path: "/",
    },
    {
      title: "商城管理",
      path: "/goods/list",
    },
  ]);
  //添加标签导航的方法
  const addTab = (tab) => {
    //首先判断标签页上的path值有没有和传入的tab相等的 如果全等于-1就说明没有找到
    let noTab = tablist.value.findIndex((t) => t.path == tab.path) == -1;
    //如果noTab为真就说明没有相同的标签页
    if (noTab) {
      tablist.value.push(tab);
    }
    cookie.set("tablist", tablist.value);
  };
  //监听路由跳转
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    //添加路由方法
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });
  //标签栏改变时浏览器路径也改变
  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };
  //初始化标签导航栏列表
  const initTabList = () => {
    let tbs = cookie.get("tablist");
    if (tbs) {
      tablist.value = tbs;
    }
  };
  initTabList();
  //移除标签页
  const removeTab = (t) => {
    let a = activeTab.value;
    let tabs = tablist.value;
    //判断是否点击删除的是当前激活的标签页
    if (a == t) {
      //遍历数组，如果tab.path = t 就取tabs的下一个标签页，若没有下一个标签页就取上一个
      tabs.forEach((tab, index) => {
        if (tab.path == t) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          // 如果有nextTab
          if (nextTab) {
            a = nextTab.path;
          }
        }
      });
    }
    activeTab.value = a;
    //只有数组内的标签页不等于当前要关闭的标签就能留下来  filter会返回一个数组
    tablist.value = tablist.value.filter((tab) => tab.path != t);

    cookie.set("tablist", tablist.value);
  };
  //关闭标签页
  const handleClose = (c) => {
    console.log("c", c);
    if (c == "clearOther") {
      //过滤只剩下首页和当前激活的标签页
      tablist.value = tablist.value.filter(
        (tab) => tab.path == "/" || tab.path == activeTab.value
      );
    } else {
      activeTab.value = "/";
      //过滤只剩下首页
      tablist.value = tablist.value.filter((tab) => tab.path == "/");
    }
    cookie.set("tablist", tablist.value);
  };

  return {
    activeTab,
    tablist,
    changeTab,
    removeTab,
    handleClose,
  };
}
