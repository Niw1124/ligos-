import { ElNotification, ElMessageBox } from "element-plus";

//消息提示
export function messageInfo(
  message,
  type = "success",
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    message,
    type,
    duration: 3000,
    dangerouslyUseHTMLString,
    offset: 100,
  });
}
export function messageConfirmationBox(
  content = "提示内容",
  type = "消息提示",
  title = ""
) {
  return ElMessageBox.confirm(content, type, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: title,
  });
}
