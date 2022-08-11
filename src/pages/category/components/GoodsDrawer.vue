<template>
  <FormComponent
    ref="FormComponentRef"
    title="推荐商品"
    @submit="openChooseGoods"
    confirmText="关联"
  >
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="goods_id" label="ID" width="60" />
      <el-table-column prop="cover" label="商品封面" width="180">
        <template #default="scope">
          <el-image
            :src="scope.row.cover"
            fit="cover"
            :lazy="true"
            style="
               {
                width: 64px;
                height: 64px;
              }
            "
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column label="操作" width="60">
        <template #default="{ row }">
          <el-popconfirm
            title="你确定要删除该关联商品吗？"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button type="text" size="small" :loading="row.loading"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormComponent>
  <ChooseGoods ref="ChooseGoodsRef" />
</template>

<script setup>
import { ref } from "vue";
import FormComponent from "~/components/formComponent.vue";
import ChooseGoods from "~/components/ChooseGoods.vue";
import {
  getCategoryGoods,
  deleteCategoryGoods,
  contentCategoryGoods,
} from "~/api/category.js";
import { messageInfo } from "~/tools/messagePopup";
//定义组件打开方法
const category_id = ref(0);
const tableData = ref([]);
const FormComponentRef = ref(null);
const open = (item) => {
  category_id.value = item.id;
  item.GoodsDrawerLoading = true;
  getData()
    .then((res) => {
      FormComponentRef.value.open();
    })
    .finally(() => {
      item.GoodsDrawerLoading = false;
    });
};
//定义打开第二层弹框的方法
const ChooseGoodsRef = ref(null);
const openChooseGoods = () => {
  ChooseGoodsRef.value.open((goods_ids) => {
    FormComponentRef.value.showLoading();
    contentCategoryGoods({
      category_id: category_id.value,
      goods_ids,
    })
      .then((res) => {
        getData();
        messageInfo("关联成功");
      })
      .finally(() => {});
    FormComponentRef.value.hideLoading();
  });
};
//获取数据的方法
function getData() {
  return getCategoryGoods(category_id.value).then((res) => {
    tableData.value = res.map((o) => {
      o.loading = false;
      return o;
    });
  });
}
//删除关联商品方法
//scope.row.id注意一定是当前列的商品id
const handleDelete = (row) => {
  row.loading = true;
  deleteCategoryGoods(row.id).then((res) => {
    messageInfo("删除成功");
    getData();
  });
};

defineExpose({
  open,
});
</script>

<style scoped></style>
