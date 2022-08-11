import axios from "~/axios";
export function getCategoryList() {
  return axios.get("/admin/category");
}
//增加商品分类
export function createCategory(data) {
  return axios.post("/admin/category", data);
}
//修改商品分类
export function updateCategory(id, data) {
  return axios.post("/admin/category/" + id, data);
}

//更新商品状态
export function updateCategoryStatus(id, status) {
  return axios.post(`/admin/category/${id}/update_status`, { status });
}
//删除商品分类
export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`);
}
//分类关联产品列表
export function getCategoryGoods(id) {
  return axios.get(`/admin/app_category_item/list?category_id=${id}`);
}
//删除关联产品
export function deleteCategoryGoods(id) {
  return axios.post(`/admin/app_category_item/${id}/delete`);
}
//删除关联产品
//data是由分类id和商品id组成的一维数组组成的
export function contentCategoryGoods(data) {
  return axios.post(`/admin/app_category_item`, data);
}
