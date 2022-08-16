import axios from "~/axios";
import { queryParams } from "~/tools/useUrlCode.js";

//获取列表
export function getOrderList(page, query = {}) {
  let r = queryParams(query);

  return axios.get(`/admin/order/${page}${r}`);
}
//批量删除
export function deleteOrder(ids) {
  return axios.post(`/admin/order/delete_all`, { ids });
}
//导出订单
export function exportOrder(query = {}) {
  let r = queryParams(query);

  return axios.post(
    `/admin/order/excelexport${r}`,
    {},
    {
      //response 是一个包含二进制数据的 Blob 对象。
      responseType: "blob",
    }
  );
}
