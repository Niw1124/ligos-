<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增和刷新 -->
    <!-- <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleCreateForm"
        >新增</el-button
      >
      <el-tooltip effect="dark" content="刷新数据" placement="top"
        ><el-button type="text" @click="getData"
          ><el-icon :size="20"><Refresh /></el-icon>
        </el-button>
      </el-tooltip>
    </div> -->
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
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
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
} from "~/api/notice.js";
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
  getList: getNoticeList,
  delete: deleteNotice,
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
  update: updateNotice,
  create: createNotice,
});
</script>

<style lang="scss" scoped></style>
