//上移
export function ArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1);
}
//下移
export function ArrayMovedown(arr, index) {
  swapArray(arr, index, index + 1);
}

function swapArray(arr, index1, index2) {
  //splice(索引位置，修改个数，修改的值)会返回一个数组，该数组是被修改过的索引的值,所以就是先给index2改成index1的值，后通过splice返回的数组修改index1的值
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
