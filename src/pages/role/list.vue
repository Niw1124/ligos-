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
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" />
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
            @click="openSetRule(scope.row)"
            >配置权限</el-button
          >
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="角色描述"
            type="textarea"
            :row="5"
          ></el-input>
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
    <!-- 配置权限 -->
    <form-component
      ref="setRuleFormComponentRef"
      :title="drawTitle"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        ref="elTreeRef"
        :data="ruleList"
        :props="{
          label: 'name',
          children: 'child',
        }"
        show-checkbox
        :height="treeHeight"
        node-key="id"
        :defaultExpandedKeys="defaultExpandedKeys"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small" effect="dark">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template></el-tree-v2
      >
    </form-component>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
} from "~/api/role.js";
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
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus,
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
    desc: "",
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "角色名字不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: updateRole,
  create: createRole,
});
//配置权限
const treeHeight = ref(0);
const roleId = ref(0);
const setRuleFormComponentRef = ref(null);
const ruleList = ref([]);
const defaultExpandedKeys = ref([]);
const elTreeRef = ref(null);
//记录起来当前角色拥有的权限id
const ruleIds = ref([]);
const openSetRule = (row) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 170;
  getRuleList(1)
    .then((res) => {
      console.log(res);
      //将res.list 赋值给ruleList
      defaultExpandedKeys.value = res.list.map((o) => o.id);
      ruleList.value = res.list;
      setRuleFormComponentRef.value.open();

      //当前角色拥有的权限Id
      ruleIds.value = row.rules.map((o) => o.id);
      setTimeout(() => {
        elTreeRef.value.setCheckedKeys(ruleIds.value);
      }, 150);
    })
    .finally(() => {});
};
const handleSetRuleSubmit = () => {};

//
</script>

<style lang="scss" scoped></style>
