<template>
  <el-card shadow="never" class="border-0">
    <list-header
      @refresh="getData"
      @increment="handleCreateForm"
      @create="handleCreateForm"
    ></list-header>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      @node-click="handleNodeClick"
      v-loading="loading"
      node-key="id"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <el-button
              text
              type="primary"
              size="small"
              @click="openGoodsDrawer(data)"
              :loading="data.GoodsDrawerLoading"
              >推荐商品</el-button
            >
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatisChange($event, data)"
            >
            </el-switch>
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleEdit(data)"
              >修改</el-button
            >
            <el-popconfirm
              title="你确定要删除该分类吗？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 表单部分 -->
    <form-component
      ref="FormComponentRef"
      :title="drawTitle"
      @submit="handleSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </form-component>

    <GoodsDrawer ref="GoodsDrawerRef"></GoodsDrawer>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import FormComponent from "~/components/formComponent.vue";
import GoodsDrawer from "./components/GoodsDrawer.vue";
import { useInitTable, useInitForm } from "~/tools/useCommon.js";
import {
  getCategoryList,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  getCategoryGoods,
} from "~/api/category.js";
const options = ref([]);
const { tableData, loading, getData, handleDelete, handleStatisChange } =
  useInitTable({
    searchForm: {
      keyword: "",
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus,
    getList: getCategoryList,
    onGetListSuccess: (res) => {
      tableData.value = res.map((o) => {
        o.GoodsDrawerLoading = false;
        return o;
      });
    },
  });

//表单部分
const {
  editId,
  FormComponentRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  resetForm,
  handleCreateForm,
  handleEdit,
} = useInitForm({
  form: {
    name: "",
  },
  rules: {},
  getData,
  update: updateCategory,
  create: createCategory,
});

//打开推荐商品弹框组件
const GoodsDrawerRef = ref(null);
const openGoodsDrawer = (data) => {
  GoodsDrawerRef.value.open(data);
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding: 20px 0;
}
</style>
