<template>
  <el-card shadow="never" class="border-0">
    <list-header @refresh="getData" @increment="handleCreateForm"></list-header>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="会员等级" align="center" />
      <el-table-column prop="discount" label="折扣率" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />
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

      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="你确定要删除该会员等级？"
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
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="desc">
          <el-input
            v-model="form.level"
            placeholder="等级权重"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs mr-2">累计消费满</small>
            <el-input
              v-model="form.max_price"
              placeholder="累计消费"
              type="number"
              style="width: 50%"
            >
              <template #append> 元</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的累计消费必须大于等于0，单位：元</small
            >
          </div>
          <div>
            <small class="text-xs mr-2">累计次数满</small>
            <el-input
              v-model="form.max_times"
              placeholder="累计次数"
              type="number"
              style="width: 50%"
            >
              <template #append> 次</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的购买量必须大于等于0，单位：笔</small
            >
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)" prop="discount">
          <el-input
            v-model="form.discount"
            placeholder="折扣率(%)"
            type="number"
            style="width: 50%"
          >
            <template #append> %</template>
          </el-input>
          <small class="text-gray-400 flex"
            >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small
          >
        </el-form-item>
      </el-form>
    </form-component>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import {
  getUserLevelList,
  createUserLevel,
  updateUserLevel,
  deleteUserLevel,
  updateUserLevelStatus,
} from "~/api/level.js";
import { getRuleList } from "~/api/rule.js";
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
  handleStatisChange,
} = useInitTable({
  getList: getUserLevelList,
  delete: deleteUserLevel,
  updateStatus: updateUserLevelStatus,
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
    name: "",
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0,
  },
  rules: {
    name: [
      {
        required: true,
        message: "会员等级名称不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: updateUserLevel,
  create: createUserLevel,
});
</script>

<style lang="scss" scoped></style>
