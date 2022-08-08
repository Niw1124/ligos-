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
//查看商品资料
export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`);
}
//设置商品轮播图
export function setGoodsBanner(id, data) {
  return axios.post(`/admin/goods/banners/${id}`, data);
}
//更新商品规格
export function updateGoodsSkus(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data);
}
//添加商品规格
export function createGoodsSkusCard(data) {
  return axios.post("/admin/goods_skus_card", data);
}
//修改商品规格
export function updateGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data);
}
