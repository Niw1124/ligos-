<template>
  <el-dialog
    title="商品选择"
    v-model="dialogVisible"
    width="80%"
    destroyOnClose
  >
    <span>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        ref="ListHeaderRef"
        @selection-change="handleSelectionChange"
        height="300px"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品">
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
          label="总库存"
          prop="stock"
          align="center"
          width="90"
        />
        <el-table-column label="价格(元)" align="center" width="150">
          <template #default="{ row }">
            <span class="text-rose-500">￥{{ row.min_price }}</span>
            <el-divider direction="vertical"></el-divider>
            <span class="text-gray-500 text-sm">￥{{ row.min_oprice }}</span>
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
    </span>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getGoodsList } from "~/api/goods.js";
import { useInitTable } from "~/tools/useCommon.js";
const {
  searchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  ListHeaderRef,
  handleSelectionChange,
  multiSelectionIds,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  },
});

const dialogVisible = ref(false);
const close = () => {
  dialogVisible.value = false;
};
const callbackFunction = ref(null);
const open = (callback = null) => {
  callbackFunction.value = callback;
  dialogVisible.value = true;
};

//提交事件
const submit = () => {
  if (typeof callbackFunction.value == "function") {
    callbackFunction.value(multiSelectionIds.value);
  }
  close();
};

defineExpose({
  open,
});
</script>

<style scoped></style>
