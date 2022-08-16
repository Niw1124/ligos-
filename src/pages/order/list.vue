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
        <search-item label="订单编号">
          <el-input
            v-model="searchForm.no"
            placeholder="订单编号"
            clearable
          ></el-input>
        </search-item>
        <template #show>
          <search-item label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="收货人"
              clearable
            ></el-input>
          </search-item>
          <search-item label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              clearable
            ></el-input>
          </search-item>
          <search-item label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始时间"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </search-item>
          <search-item label="结束时间">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="结束时间"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </search-item>
        </template>
      </search>

      <!-- 新增和刷新 -->
      <list-header
        layout="refresh,download"
        @refresh="getData"
        @download="handleExportExcel"
      >
        <el-button
          type="danger"
          size="small"
          @click="handleMultiDelete(1)"
          v-if="searchForm.tab != 'delete'"
          >批量删除</el-button
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
        <el-table-column label="商品" width="500">
          <template #default="{ row }">
            <div class="flex text-sm">
              <div class="flex-1">
                <p class="ml-auto">订单号:</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间:</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div
              class="flex py-2"
              v-for="(item, index) in row.order_items"
              :key="index"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover : ''"
                fit="cover"
                :lazy="true"
                style="width: 30px; height: 30px"
                class="mr-2"
              ></el-image>
              <p class="text-blue-500">
                {{ item.goods_item ? item.goods_item.title : "商品已被删除" }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实付款"
          prop="total_price"
          align="center"
          width="120"
        />

        <el-table-column label="买家" width="120" align="center">
          <template #default="{ row }">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small>(用户ID：{{ row.user_id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="170" align="center">
          <template #default="{ row }">
            <div>
              付款状态:<el-tag
                v-if="row.payment_method == 'wechat'"
                type="success"
                size="small"
                >微信支付</el-tag
              >
              <el-tag v-else-if="row.payment_method == 'alipay'" size="small"
                >支付宝支付</el-tag
              >
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态:<el-tag
                :type="row.ship_data ? 'success' : 'info'"
                size="small"
                >{{ row.ship_data ? "已发货" : "未发货" }}</el-tag
              >
            </div>

            <div>
              收货状态:<el-tag
                :type="row.ship_status == 'received' ? 'success' : 'info'"
                size="small"
                >{{
                  row.ship_status == "received" ? "已收货" : "未收货"
                }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div>
              <el-button
                class="px-1"
                type="primary"
                size="small"
                text
                @click="openInfoModel(scope.row)"
                >订单详情</el-button
              >
              <el-button
                v-if="searchForm.tabbars == 'noship'"
                class="px-1"
                type="primary"
                size="small"
                text
                >订单发货</el-button
              >
              <el-button
                v-if="searchForm.tabbars == 'refunding'"
                class="px-1"
                type="primary"
                size="small"
                text
                >同意退款</el-button
              >
              <el-button
                v-if="searchForm.tabbars == 'refunding'"
                class="px-1"
                type="primary"
                size="small"
                text
                >拒绝退款</el-button
              >
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
      <ExportExcel :tabs="tabbars" ref="ExportExcelRef" />
      <info-model ref="InfoModelRef" :info="info"></info-model>
    </el-card>
  </div>
</template>

<script setup>
import { getOrderList, deleteOrder } from "~/api/order.js";
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
import { useInitTable } from "~/tools/useCommon.js";
import ExportExcel from "./ExportExcel.vue";
import InfoModel from "./InfoModel.vue";
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
  multiSelectionIds,
} = useInitTable({
  searchForm: {
    tab: "all",
    no: "",
    starttime: "",
    endtime: "",
    name: "",
    phone: "",
  },
  delete: deleteOrder,
  getList: getOrderList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
});

//订单类型
const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

//导出文件功能
const ExportExcelRef = ref(null);
const handleExportExcel = () => {
  ExportExcelRef.value.open();
};

//订单详情打开弹出层的方法
const InfoModelRef = ref(null);
const info = ref(null);
const openInfoModel = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const k in o.goods_skus.skus) {
        //将value追加到数组
        s.push(o.goods_skus.skus[k].value);
      }
      //再将数组用逗号分割转成字符串赋值给新建的o.sku
      o.sku = s.join(",");
    }
    return o;
  });
  info.value = row;
  InfoModelRef.value.open();
};
</script>

<style></style>
