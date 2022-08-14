import { createRouter, createWebHashHistory } from "vue-router";
import Index from "~/pages/index.vue";
import Login from "~/pages/login/login.vue";
import NotFound from "~/pages/404.vue";
import Admin from "~/pages/layouts/admin.vue";
import GoodsList from "~/pages/goods/list.vue";
import Category from "~/pages/category/list.vue";
import Userlist from "~/pages/user/list.vue";
import Couponlist from "~/pages/coupon/list.vue";
import Noticelist from "~/pages/notice/list.vue";
import Settingbase from "~/pages/setting/list.vue";
import Orderlist from "~/pages/order/list.vue";
import Imagelist from "~/pages/image/list.vue";
import Commentlist from "~/pages/comment/list.vue";
import ManagerList from "~/pages/manager/list.vue";
import AccessList from "~/pages/access/list.vue";
import RoleList from "~/pages/role/list.vue";
import SkusList from "~/pages/skus/list.vue";
import LevelList from "~/pages/level/list.vue";
//这是默认路由
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
    meta: {
      title: "首页",
    },
  },
  //这是404页面路由
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404",
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "欢迎使用",
    },
  },
];
//定义动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: Index,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodsList,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: Category,
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: Userlist,
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: Orderlist,
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: Commentlist,
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: Imagelist,
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: Noticelist,
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: Settingbase,
    meta: {
      title: "配置列表",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: Couponlist,
    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    meta: {
      title: "权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: RoleList,
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: LevelList,
    meta: {
      title: "会员等级",
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(), //注意这里一定要加（）执行
  routes: routes,
});
//动态添加路由的方法并导出
//用到递归
export function addRoutes(menus) {
  //定义一个是否有新的变量
  let hasNewRoutes = false;
  const findAndAddRouteByMenus = (arr) => {
    //遍历传进来的数组
    arr.forEach((e) => {
      // asyncRoutes与后端菜单传过来的是否匹配 如果匹配，则将其拿出来赋给item
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      //如果item存在并且之前不存在路由
      if (item && !router.hasRoute(item.path)) {
        //则添加路由  注意存在父级所以添加嵌套路由是在admin的子路由下添加的
        router.addRoute("admin", item);
        hasNewRoutes = true;
      }
      //这里就是进行递归 一层一层的去添加路由 如果e还有子路由就再次执行findAndAddRouteByMenus并且将e.child传进去
      if (e.child && e.child.length > 0) {
        findAndAddRouteByMenus(e.child);
      }
    });
  };
  findAndAddRouteByMenus(menus);
  return hasNewRoutes;
}
