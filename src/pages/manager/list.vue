<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <search-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="管理员昵称"
          clearable
        ></el-input>
      </search-item>
    </search>
    <!-- 新增和刷新 -->
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属角色" align="center">
        <template #default="{ row }">
          <div>{{ row.role ? row.role.name : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatisChange($event, row)"
            :loading="row.statusLoading"
            :disabled="row.super == 1"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <div v-else>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="你确定要删除该管理员？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="用户密码"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <choose-image v-model="form.avatar"></choose-image>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </form-component>
  </el-card>
</template>

<script setup>
import {
  getManagerList,
  updatedManagerStatus,
  createManager,
  updateManager,
  deleteManager,
} from "~/api/manager.js";
import { ref } from "vue";
import FormComponent from "~/components/formComponent.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
import ChooseImage from "~/components/chooseImage.vue";
import { useInitTable, useInitForm } from "~/tools/useCommon.js";
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatisChange,
} = useInitTable({
  searchForm: {
    keyword: "",
  },
  delete: deleteManager,
  updateStatus: updatedManagerStatus,
  getList: getManagerList,
  onGetListSuccess: (res) => {
    roles.value = res.roles;
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
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
    username: "",
    password: "",
    role_id: 0,
    status: 1,
    avatar: "",
  },
  getData,
  update: updateManager,
  create: createManager,
});

const roles = ref([]);
</script>

<style lang="scss" scoped></style>
