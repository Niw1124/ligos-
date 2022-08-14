<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <search-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="手机号/邮箱/会员昵称"
          clearable
        ></el-input>
      </search-item>
      <template #show>
        <search-item label="会员等级">
          <el-select
            v-model="searchForm.user_level_id"
            placeholder="请选择会员等级"
          >
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </search-item>
      </template>
    </search>
    <!-- 新增和刷新 -->
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="会员" width="200">
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
      <el-table-column label="会员等级" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" align="center">
        <template #default="{ row }">
          <p v-if="row.last_login_time">最后登录：{{ row?.last_login_time }}</p>
          <p>注册时间：{{ row.create_time }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
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
              title="你确定要删除该用户？"
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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <choose-image v-model="form.avatar"></choose-image>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级">
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
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
  getUserList,
  updatedUserStatus,
  createUser,
  updateUser,
  deleteUser,
} from "~/api/user.js";
import { ref } from "vue";
import FormComponent from "~/components/formComponent.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
import ChooseImage from "~/components/chooseImage.vue";
import { useInitTable, useInitForm } from "~/tools/useCommon.js";

//定义一个user_level
const user_level = ref([]);
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
    user_level_id: null,
  },
  delete: deleteUser,
  updateStatus: updatedUserStatus,
  getList: getUserList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    user_level.value = res.user_level;
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
    status: 1,
    nickname: "",
    phone: "",
    email: "",
    avatar: "",
    user_level_id: "",
  },
  getData,
  update: updateUser,
  create: createUser,
});
</script>

<style lang="scss" scoped></style>
