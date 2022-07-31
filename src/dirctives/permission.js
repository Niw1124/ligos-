import store from "~/store/index.js";

function hasPermission(value, el = false) {
  //如果传入的不是数组就报错
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如v-permission="['getStatistics3,GET']"`);
    //只要查到就说明有包含别名代表有这个权限
  }
  const hasAuth =
    //findIndex找到了返回1 找不到返回-1
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  //如果有这个节点并且没有该权限就获取该节点的父节点后移除el
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.remove(el);
  }
  return hasAuth;
}

export default {
  install(app) {
    //这里的app就是createApp的实例
    app.directive("permission", {
      mounted(el, binding) {
        // el就是当前自定义指令拿到的节点
        //binding.value就是当前节点的别名用来和ruleNames作比较
        console.log(binding.value);
        hasPermission(binding.value, el);
      },
    });
  },
};
