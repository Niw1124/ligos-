import nprogress from "nprogress";
//显示全屏loading
export function showLoading() {
  nprogress.start();
}

//隐藏全屏loading
export function unShowLoading() {
  nprogress.done();
}
