import { ref } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
} from "~/api/goods";
import { messageInfo } from "~/tools/messagePopup";
import { ArrayMoveUp, ArrayMovedown } from "~/tools/useArrayIndexUpOrDown.js";
//当前商品ID存起来
export const goodsId = ref(0);

//规格选项列表
export const sku_card_list = ref([]);

//初始化规格选项列表
export function initSkuCardList(d) {
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    //这里定义text是为了防止修改name失败，会回到原来的值，也就是说我们不能直接修改里面的name，如果直接修改name会导致修改不回来，所以我们为了如果提交失败的时候回到原来的值，在这个对象定义一个text和name属性相同的值，之后v-model修改text属性，只有说提交成功后才把name值改了
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      //同前面的item.text = item.name;
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
}
//增强体验添加loading
export const btnLoading = ref(false);
//添加规格选项
export function createSkuCardEvent() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goodsId.value, //商品ID
    name: "规格选项", //规格名称
    order: 50, //排序
    type: 0, //规格类型 0文字
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
      messageInfo("添加成功");
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

//修改规格选项
export function handleUpdate(item) {
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: item.type,
  })
    .then((res) => {
      item.name = item.text;
      messageInfo("修改成功");
    })
    .catch((err) => {
      item.text = item.name;
      messageInfo("删除失败");
    })
    .finally(() => {
      item.loading = false;
    });
}
//删除规格选项
export function handleDelete(item) {
  item.loading = true;
  deleteGoodsSkusCard(item.id).then((res) => {
    //findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1。
    //findIndex如果没找到就返回-1 如果在sku_card_list里面找到了该id，就删除该位置的索引
    const i = sku_card_list.value.findIndex((o) => o.id == item.id);
    if (i != -1) {
      sku_card_list.value.splice(i, 1);
      messageInfo("删除成功");
    }
  });
}

//排序规格选项
export function sortCard(action, index) {
  //sku_card_list.value是要操作的数组
  if (action == "up") {
    ArrayMoveUp(sku_card_list.value, index);
  } else {
    ArrauMovedown(sku_card_list.value, index);
  }
}

//初始化规格值
export function initSkuCardItem(id) {
  //因为前面规格选项列表中用到了goodsSkusCardValue的数据所以要检查传过来的id是否和sku_card_list的id一致，如果一致就拿到并以对象的形式返回，这样就可以在skuCardItem中拿到
  const item = sku_card_list.value.find((o) => o.id == id);
  return { item };
}
