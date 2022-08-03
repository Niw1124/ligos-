<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane
        :label="item.name"
        :name="item.key"
        v-for="(item, index) in tabbars"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <search-item label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品名称"
            clearable
          ></el-input>
        </search-item>

        <template #show>
          <search-item label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option> </el-select
          ></search-item>
        </template>
      </search>

      <!-- 新增和刷新 -->
      <list-header
        @refresh="getData"
        @increment="handleCreateForm"
      ></list-header>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="商品" width="300" align="center">
          <template #default="{ row }">
            <div class="flex">
              <el-image
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
                class="mr-3"
              ></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.min_oprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类：{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间：{{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际销量"
          prop="sale_count"
          align="center"
          width="80"
        />

        <el-table-column label="商品状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status == 0 ? 'success' : 'danger'"
              size="small"
              text
              >{{ row.status == 0 ? "上架" : "仓库" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="120"
          align="center"
          v-if="searchForm.tab != 'delete'"
        >
          <template #default="{ row }">
            <div class="flex flex-col" v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button type="danger" size="small" plain class="mt-2 !ml-0"
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{
              row.ischeck == 1 ? "审核通过" : "审核不通过"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总库存"
          prop="stock"
          align="center"
          width="90"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button class="px-1" type="primary" size="small" text
                >商品规格</el-button
              >
              <el-button class="px-1" type="primary" size="small" text
                >设置轮播图</el-button
              >
              <el-button class="px-1" type="primary" size="small" text
                >商品详情</el-button
              >
              <el-popconfirm
                title="你确定要删除该商品？"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <span v-else>暂停操作</span>
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
  </div>
</template>

<script setup>
import {
  getGoodsList,
  updatedGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods,
} from "~/api/goods.js";
import { getCategoryList } from "~/api/category.js";
import { ref } from "vue";
import FormComponent from "~/components/formComponent.vue";
import ListHeader from "~/components/ListHeader.vue";
import ChooseImage from "~/components/chooseImage.vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
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
    title: "",
    tab: "all",
    category_id: null,
  },
  delete: deleteGoods,
  updateStatus: updatedGoodsStatus,
  getList: getGoodsList,
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
  update: updateGoods,
  create: createGoods,
});

const roles = ref([]);
//订单类型
const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

//商品分类
const category_list = ref([]);
getCategoryList()
  .then((res) => {
    category_list.value = res;
  })
  .finally(() => {});
</script>

<style></style>
