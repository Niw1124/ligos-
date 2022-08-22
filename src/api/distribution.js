import axios from "~/axios";
import { queryParams } from "~/tools/useUrlCode.js";
export function getAgentStatistics() {
  return axios.get("/admin/agent/statistics");
}

//获取列表
export function getAgentList(page, query = {}) {
  let r = queryParams(query);

  return axios.get(`/admin/agent/${page}${r}`);
}
// 推广订单列表
export function getAgentOrderList(page, query = {}) {
  let r = queryParams(query);

  return axios.get(`/admin/user_bill/${page}${r}`);
}
// 获取设置
export function getConfig() {
  return axios.get(`/admin/distribution_setting/get`);
}

//修改设置
export function setConfig(data) {
  return axios.post(`/admin/distribution_setting/set`, data);
}
