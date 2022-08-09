<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="15vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="chooseSku">
        <div class="top">
          {{ tableData }}
          <!-- <aside-list
            v-for="(item, index) in list"
            :key="index"
            :active="activeId == item.id"
            @edit="handleEdit(item)"
            @delete="handleDelete(item.id)"
            @click="handleChangeActiveId(item.id)"
            >{{ item.name }}</aside-list
          > -->
        </div>
        <div class="bottom">
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, next"
            :total="total"
            :current-page="currentPage"
            :page-size="limit"
            @current-change="getData"
          />
        </div>
      </el-aside>
      <el-main> 主体部分 </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getSkusList } from "~/api/skus.js";
import { useInitTable } from "~/tools/useCommon.js";
const dialogVisible = ref(false);

//初始化列表方法useInitTable
const { tableData, total, limit, getData, loading, currentPage } = useInitTable(
  {
    getList: getSkusList,
  }
);

//打开弹框的方法
const open = () => {
  dialogVisible.value = true;
  getData(1);
};
//关闭弹框的方法
const close = () => {
  dialogVisible.value = false;
};
const submit = () => {};

//将方法导出
defineExpose({
  open,
  close,
});
</script>

<style scoped>
.chooseSku {
  border-right: 1px solid #eee;
  position: relative;
}
.top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
</style>
