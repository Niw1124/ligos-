<template>
  <el-card shadow="never" class="border-0">
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="优惠券名称" width="350">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded">
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }}~{{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" />
      <el-table-column label="优惠">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded">
            {{ row.type ? "满减" : "折扣"
            }}{{ row.type ? "￥" + row.value : row.value + "折" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发布数量" />
      <el-table-column prop="used" label="已使用" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="你确定要删除该公告？"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
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
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="公告内容"
            type="textarea"
            :row="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-component>
  </el-card>
</template>

<script setup>
import {
  getCouponList,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
} from "~/api/coupon.js";
import FormComponent from "~/components/formComponent.vue";
import { useInitTable, useInitForm } from "~/tools/useCommon.js";
import ListHeader from "~/components/ListHeader.vue";
const {
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
} = useInitTable({
  getList: getCouponList,
  delete: deleteCoupon,
});
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
    title: "",
    content: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "公告标题不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "公告标题不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: updateCoupon,
  create: createCoupon,
});
</script>

<style lang="scss" scoped></style>
