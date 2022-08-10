import { ref, nextTick, computed } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkuCard,
} from "~/api/goods";
import { messageInfo } from "~/tools/messagePopup";
import { ArrayMoveUp, ArrayMovedown } from "~/tools/useArrayIndexUpOrDown.js";
//当前商品ID存起来
export const goodsId = ref(0);

//规格选项列表
export const sku_card_list = ref([]);

//初始化规格选项列表
//这里的d是查看商品资料接口返回的数据

//表格数据存储在goodsSkus中也就是说sku_list内存的就是要渲染的表格的数据
export const sku_list = ref([]);
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

  sku_list.value = d.goodsSkus;
  // console.log(sku_list);
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
    type: 0,
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
    getTableData();
  });
}
export const bodyLoading = ref(false);

//排序规格选项
export function sortCard(action, index) {
  let oList = JSON.parse(JSON.stringify(sku_card_list.value));
  // sku_card_list.value是要操作的数组
  let func = action == "up" ? ArrayMoveUp : ArrayMovedown;
  func(oList, index);
  //o表示当前对象 i表示当前索引 经过map处理后变成后端要的结构
  let sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });
  bodyLoading.value = true;
  sortGoodsSkusCard({
    sortdata: sortData,
  })
    .then((res) => {
      //成功后再修改原数组的位置，相当于要执行两次   if (action == "up") {     ArrayMoveUp(oList, index);  } else {     ArrauMovedown(oList, index); }
      //为了防止代码冗余用func接收一下action == "up" ? ArrayMoveUp : ArrauMovedown;
      func(sku_card_list.value, index);
      getTableData();
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

//选择设置规格
export function handleChooseAndSetGoodsSkuCard(id, data) {
  //在sku_card_list中找和传入id匹配的规格的id
  let item = sku_card_list.value.find((o) => o.id == id);
  item.loading = true;
  chooseAndSetGoodsSkuCard(id, data)
    .then((res) => {
      //规格选项对应数据
      item.name = item.text = res.goods_skus_card.name;
      //规格值的对应数据
      item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || "属性值";
        return o;
      });
      getTableData();
    })
    .finally(() => {
      item.loading = false;
    });
}

//初始化规格值
export function initSkuCardItem(id) {
  //因为前面规格选项列表中用到了goodsSkusCardValue的数据所以要检查传过来的id是否和sku_card_list的id一致，如果一致就拿到并以对象的形式返回，这样就可以在skuCardItem中拿到
  const item = sku_card_list.value.find((o) => o.id == id);
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();

  //删除规格选项值
  const handleClose = (tag) => {
    loading.value = true;
    deleteGoodsSkusCardValue(tag.id)
      .then((res) => {
        let i = item.goodsSkusCardValue.findIndex((o) => o.id == tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
        }
        getTableData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  //添加规格值
  const handleInputConfirm = () => {
    //如果没有值就直接关闭并return终止掉
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    //goods_skus_card_id就是规格的id即传入的值id name是find返回item的name
    createGoodsSkusCardValue({
      goods_skus_card_id: id,
      name: item.name,
      order: 50,
      value: inputValue.value,
    })
      .then((res) => {
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
        getTableData();
      })
      .finally(() => {
        loading.value = false;
        inputVisible.value = false;
        inputValue.value = "";
      });
  };

  //修改规格值
  const handleChange = (value, tag) => {
    loading.value = true;
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id,
      name: item.name,
      order: tag.order,
      value: value,
    })
      .then((res) => {
        //修改成功之后将tag的值改为新值
        tag.value = value;
        getTableData();
      })
      .catch((err) => {
        //失败的话就该回原来的值
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,
  };
}
//初始化表格
export function initSkuTable() {
  //表头名称
  const skuLabels = computed(() =>
    //如果新添加的规格他没有规格值的话就没有必要添加到表格中,将合格的数据返回到skuLabels中
    sku_card_list.value.filter((v) => v.goodsSkusCardValue.length > 0)
  );

  //获取表头的数据
  const tableThs = computed(() => {
    //获取有多少个规格（skuLabels）的选项
    let length = skuLabels.value.length;
    return [
      {
        name: "商品规格",
        //列合并，决定于表头skuLabels有多少个规格选项
        colspan: length,
        width: "",
        //如果有数据就纵向合并一行没有skuLabels（还没有添加规格）就合并两行
        rowspan: length > 0 ? 1 : 2,
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });

  return {
    skuLabels,
    tableThs,
    sku_list,
  };
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}

//获取规格表格数据
function getTableData() {
  setTimeout(() => {
    if (sku_card_list.value.length === 0) return [];
    //定一个数组存放规格选项值组合的数组
    let list = [];
    sku_card_list.value.forEach((o) => {
      //如果规格选项值存在且不为0就将其push进list中
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue);
      }
    });
    if (list.length == 0) {
      return [];
    }
    console.log(list);
    //arr就是排列组合之后的数据了
    let arr = cartesianProductOf(...list);
    sku_list.value = [];
    //把整理之后的值赋值给sku_card_list即可
    sku_list.value = arr.map((o) => {
      return {
        code: "",
        cprice: "0.00",
        goods_id: goodsId.value,
        image: "",
        oprice: "0.00",
        pprice: "1.00",
        //o是一个数组
        skus: o,
        stock: 0,
        volume: 0,
        weight: 0,
      };
    });
  }, 200);
}
