import axios from "~/axios";

export function getImageList(id, page = 1) {
  return axios.get(`/admin/image_class/${id}/image/${page}`);
}
export function deleteImage(ids) {
  return axios.post("/admin/image/delete_all", { ids });
}
export function changeImageName(id, name) {
  return axios.post(`/admin/image/${id}`, { name });
}
export const uploadImageAction = "/api/admin/image/upload";
