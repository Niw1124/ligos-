<template>
  <div>
    <el-drawer
      v-model="showDrawer"
      :title="title"
      :size="size"
      :closeOnClickModal="false"
      :destroyOnClose="destroyOnClose"
    >
      <div class="formDrawer">
        <div class="body">
          <slot></slot>
        </div>
        <div class="actions">
          <el-button
            type="primary"
            round
            color="#626aef"
            @click="submit"
            :loading="loading"
            >{{ confirmText }}</el-button
          >
          <el-button type="default" @click="close" round color="#626aef"
            >取消</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const loading = ref(false);
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);
const showDrawer = ref(false);
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: "40%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
});

//打开抽屉组件
const open = () => {
  showDrawer.value = true;
};
//关闭抽屉组件
const close = () => {
  showDrawer.value = false;
};
//提交
const emit = defineEmits(["submit"]);
const submit = () => emit("submit");

//向父组件暴露以下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>

<style>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}
.body {
  background: #fff;
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
.actions {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>
