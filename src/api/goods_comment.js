import axios from "~/axios";
import { queryParams } from "~/tools/useUrlCode.js";

export function getGoodsCommentList(page, query = {}) {
  let r = queryParams(query);

  return axios.get(`/admin/goods_comment/${page}${r}`);
}
export function updatedGoodsCommentStatus(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, { status });
}
//回复用户评价
export function replyToUserComments(id, data) {
  return axios.post(`/admin/goods_comment/review/${id}`, { data });
}
