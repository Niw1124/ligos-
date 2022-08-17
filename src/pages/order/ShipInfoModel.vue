<template>
  <el-drawer
    title="物流信息"
    v-model="dialogVisible"
    size="40%"
    style="top: 60px"
  >
    <!-- 公司信息 -->
    <el-card shadow="never" class="border-0 mb-3">
      <div class="flex items-center">
        <el-image
          :src="info.logo"
          fit="fill"
          :lazy="true"
          style="height: 60px; width: 60px"
          class="rounded border"
        ></el-image>
        <div class="ml-3">
          <p>物流公司:{{ info.typename }}</p>
          <p>物流单号:{{ info.number }}</p>
        </div>
      </div>
    </el-card>
    <!-- 物流信息 -->
    <el-card shadow="never" class="border-0 border-t"
      ><el-timeline class="ml-[-40px]">
        <el-timeline-item
          :timestamp="item.time"
          placement="top"
          v-for="(item, index) in info.list"
          :key="index"
        >
          {{ item.status }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { getShipInfo } from "~/api/order.js";
import { messageInfo } from "../../tools/messagePopup";
const dialogVisible = ref(false);

//将返回成功的信息存储起来
const info = ref({});
const open = (id) => {
  return getShipInfo(id)
    .then((res) => {
      if (res.status != 0) {
        return messageInfo(res.msg, "error");
      }
      info.value = res.result;
      console.log(res.result);
      dialogVisible.value = true;
    })
    .finally(() => {});
};

const close = () => {
  dialogVisible.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<style>
.el-drawer.ltr,
.el-drawer.rtl {
  height: 100%;
  top: 67px;
  bottom: 0;
}
</style>
