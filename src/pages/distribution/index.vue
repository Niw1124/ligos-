<template>
  <div>
    <Pannel></Pannel>
    <el-card shadow="never" class="border-0">
      <search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <search-item label="时间选择">
          <el-radio-group v-model="searchForm.type" bo>
            <el-radio-button label="all"> 全部 </el-radio-button>
            <el-radio-button label="today"> 今天 </el-radio-button>
            <el-radio-button label="yesterday"> 昨天 </el-radio-button>
            <el-radio-button label="last7days"> 最近7天 </el-radio-button>
          </el-radio-group>
        </search-item>
        <template #show>
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
          <search-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="关键词"
              clearable
            ></el-input>
          </search-item>
        </template>
      </search>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="头像" width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="200">
          <template #default="{ row }">
            <div class="text-xs">
              <p>用户：{{ row.username }}</p>
              <p>昵称：{{ row.nickname }}</p>
              <p>姓名：{{ row.user_info.name }}</p>
              <p>电话：{{ row.phone }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广用户数量" prop="share_num" align="center" />
        <el-table-column
          label="订单数量"
          prop="share_order_num"
          align="center"
        />
        <el-table-column label="订单金额" prop="order_price" align="center" />
        <el-table-column label="账户佣金" prop="commission" align="center" />
        <el-table-column
          label="已提现金额"
          prop="cash_out_price"
          align="center"
        />
        <el-table-column label="提现次数" prop="cash_out_time" align="center" />
        <el-table-column
          label="未提现金额"
          prop="no_cash_out_price"
          align="center"
        />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <div>
              <el-button
                type="primary"
                size="small"
                text
                @click="openDrawer(scope.row.id, 'user')"
                >推广人</el-button
              >
              <el-button
                type="primary"
                size="small"
                text
                @click="openDrawer(scope.row.id, 'order')"
                >推广订单</el-button
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
    </el-card>
    <dataDrawer ref="dataDrawerRef"></dataDrawer>
    <dataDrawer ref="orderDrawerRef" type="order"></dataDrawer>
  </div>
</template>

<script setup>
import Pannel from "./pannel.vue";
import { getAgentList } from "~/api/distribution.js";
import { ref } from "vue";
import dataDrawer from "./dataDrawer.vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
import { useInitTable } from "~/tools/useCommon.js";

const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
} = useInitTable({
  searchForm: {
    keyword: "",
    type: "all",
    starttime: null,
    endtime: null,
    // level: 0,
    // user_id: 0,
  },
  getList: getAgentList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  },
});

const dataDrawerRef = ref(null);
const orderDrawerRef = ref(null);
const openDrawer = (id, type) => {
  (type == "user" ? dataDrawerRef : orderDrawerRef).value.open(id);
};
</script>

<style lang="scss" scoped></style>
