<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="15vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="chooseSku">
        <div class="top">
          <div
            class="sku-list"
            v-for="(item, index) in tableData"
            :key="index"
            :class="{ active: activeId == item.id }"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
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
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
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
import { reactive, ref } from "vue";
import { getSkusList } from "~/api/skus.js";
import { useInitTable } from "~/tools/useCommon.js";
const dialogVisible = ref(false);

//初始化列表方法useInitTable
const { tableData, total, limit, getData, loading, currentPage } = useInitTable(
  {
    getList: getSkusList,
    onGetListSuccess(res) {
      //将获取到的列表数据赋值给tableData，获取到的总数赋值给total
      tableData.value = res.list;
      total.value = res.totalCount;
      if (tableData.value.length > 0) {
        handleChangeActiveId(tableData.value[0].id);
      }
    },
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

//侧边栏激活状态和点击侧边栏切换主体内容
const list = ref([]);
const form = reactive({
  list: [],
});
const activeId = ref(0);
function handleChangeActiveId(id) {
  activeId.value = id;
  list.value = [];
  //在tableData中找到传入id对应的item保存下来
  let item = tableData.value.find((o) => o.id == id);
  if (item) {
    //将其转换为数组格式
    list.value = item.default.split(",");
  }
}

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
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
