import axios from "axios";
import { messageInfo } from "~/tools/messagePopup";
import { getToken } from "~/tools/cookieFunction";
import store from "~/store/index";

const service = axios.create({
  baseURL: "/api",
  timeout: 1000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //往header头自动添加token
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = error.response.data.msg;
    if (msg == "非法token，请先登录！") {
      store.dispatch("logOut").finally(() => {
        location.reload();
      });
    }
    messageInfo(msg || "请求失败", error);
    return Promise.reject(error);
  }
);

export default service;