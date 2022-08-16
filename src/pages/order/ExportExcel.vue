<template>
  <el-drawer title="导出订单" v-model="dialogVisible" size="40%">
    <el-form :model="form" label-width="80px">
      <el-form-item label="订单类型">
        <el-select v-model="form.tab" placeholder="请选择">
          <el-option
            v-for="item in tabs"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :size="size"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { exportOrder } from "~/api/order.js";
import { messageInfo } from "../../tools/messagePopup";
defineProps({
  tabs: Array,
});

const dialogVisible = ref(false);

//loading
const loading = ref(false);

const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

const form = reactive({
  tab: null,
  //日期范围是一个数组，但是我们把他处理成字符串
  time: "",
});

const onSubmit = () => {
  //如果form.tab为空
  if (!form.tab) {
    return messageInfo("订单类型不能为空", "error");
  }
  loading.value = true;
  let starttime = null;
  let endtime = null;
  if (form.time && Array.isArray(form.time)) {
    starttime = form.time[0];
    endtime = form.time[1];
  }
  exportOrder({
    tab: form.tab,
    starttime,
    endtime,
  })
    .then((res) => {
      let url = window.URL.createObjectURL(new Blob([res]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      let filename = new Date().getTime() + ".xlsx";
      //将a元素的download属性的值设置为filename，即为其下载下来的改名
      link.setAttribute("download", filename);
      //将link元素挂载到页面中
      document.body.appendChild(link);
      //执行link.click
      link.click();
      close();
    })
    .finally(() => {
      loading.value = false;
    });
};
defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped></style>
