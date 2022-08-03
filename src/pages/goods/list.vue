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
        layout="increment,refresh,delete"
        @refresh="getData"
        @increment="handleCreateForm"
        @delete="handleMultiDelete"
      >
        <el-button
          size="small"
          @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
          >上架</el-button
        >
        <el-button
          size="small"
          @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
          >下架</el-button
        >
      </list-header>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        ref="ListHeaderRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
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
              :type="row.status == 0 ? 'danger' : 'success'"
              size="small"
              text
              >{{ row.status == 0 ? "仓库" : "上架" }}</el-tag
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
              <el-button
                class="px-1"
                size="small"
                :type="
                  scope.row.goods_banner.length == 0 ? 'danger' : 'primary'
                "
                text
                @click="handleGoodsBanners(scope.row)"
                :loading="scope.row.bannersLoading"
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
          <el-form-item label="商品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入商品名称，不能超过60个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <choose-image v-model="form.cover"></choose-image>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择商品分类">
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input
              v-model="form.desc"
              placeholder="选填，商品卖点简述"
              type="textarea"
              rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入单位"
              style="width: 50%"
            ></el-input>
          </el-form-item>

          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 40%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 40%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 40%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input
              v-model="form.min_oprice"
              type="number"
              style="width: 40%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">立即上架</el-radio>
              <el-radio :label="0">放入仓库</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </form-component> </el-card
    ><banners ref="bannersRef" @reloadData="getData"></banners>
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
import Banners from "~/pages/goods/banners.vue";
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
  handleSelectionChange,
  //表格节点的绑定
  ListHeaderRef,
  //批量删除
  handleMultiDelete,
  //批量修改状态
  handleMultiStatusChange,
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
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
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
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 0, //最低原价
  },
  getData,
  update: updateGoods,
  create: createGoods,
});

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

//轮播图组件
const bannersRef = ref(null);
const handleGoodsBanners = (row) => {
  bannersRef.value.open(row);
};
</script>

<style></style>
