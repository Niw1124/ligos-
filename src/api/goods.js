import axios from "~/axios";
import { queryParams } from "~/tools/useUrlCode.js";
export function getGoodsList(page, query = {}) {
  let r = queryParams(query);

  return axios.get(`/admin/goods/${page}${r}`);
}
//批量上架/下架
export function updatedGoodsStatus(ids, status) {
  return axios.post(`/admin/goods/changestatus`, { ids, status });
}
export function createGoods(data) {
  return axios.post("/admin/goods", data);
}
export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}
export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, { ids });
}
