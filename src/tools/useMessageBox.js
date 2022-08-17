import { ElMessageBox } from "element-plus";

export function popUpInputBox(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}
