<template>
  <el-card shadow="never" class="border-0">
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="优惠券名称" width="350">
        <template #default="{ row }">
          <div
            class="border border-dashed py-2 px-4 rounded"
            :class="row.statusText == '领取中' ? 'active' : 'inactive'"
          >
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }}~{{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" />
      <el-table-column label="优惠">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded">
            {{ row.type == 0 ? "满减" : "折扣"
            }}{{ row.type == 0 ? "￥" + row.value : row.value + "折" }}
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
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="优惠券名称"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <div style="margin-top: 20px">
            <el-radio-group v-model="form.type">
              <el-radio label="0" border>满减</el-radio>
              <el-radio label="1" border>折扣</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <div class="mt-4">
            <el-input
              v-model="form.value"
              placeholder="面值"
              style="width: 50%"
            >
              <template #append>{{ form.type == 0 ? "元" : "折" }}</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" :min="0" :max="10000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price">
          <div class="mt-4">
            <el-input v-model="form.min_price" placeholder="最低使用价格">
              <template #append>{{ "元" }}</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="10000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="活动时间" prop="content">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              :editable="false"
              v-model="timeRange"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="描述"></el-input>
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
import { computed } from "@vue/runtime-core";
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
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      //转化优惠券状态
      o.statusText = formatStatus(o);
      return o;
    });
    total.value = res.totalCount;
  },
  delete: deleteCoupon,
});

function formatStatus(row) {
  let s = "领取中";
  //传过来的数据是字符串，转为时间戳格式
  let start_time = new Date(row.start_time).getTime();
  let now = new Date().getTime();
  let end_time = new Date(row.end_time).getTime();
  if (start_time > now) {
    s = "未开始";
  } else if (end_time < now) {
    s = "已结束";
  } else if (row.status == 0) {
    s = "已失效";
  }
  return s;
}

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
    type: 0,
    value: 0,
    total: 130,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
  },
  getData,
  update: updateCoupon,
  create: createCoupon,
  beforeSubmit: (f) => {
    if (typeof f.start_time != "number") {
      f.start_time = new Date(f.start_time).getTime();
    }
    if (typeof f.end_time != "number") {
      f.end_time = new Date(f.end_time).getTime();
    }
    return f;
  },
});

//表单日期功能
const timeRange = computed({
  get: () => {
    return form.start_time && form.end_time
      ? [form.start_time, form.end_time]
      : [];
  },
  set: (val) => {
    form.start_time = val[0];
    form.end_time = val[1];
  },
});
</script>

<style scoped>
.active {
  @apply border-rose-500 bg-rose-50 text-rose-400 border-solid;
}
.inactive {
  @apply border-gray-500 bg-gray-50 text-gray-400;
}
</style>
