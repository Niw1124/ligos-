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
