<template>
  <el-drawer
    title="设置轮播图"
    v-model="dialogVisible"
    size="50%"
    :destroy-on-close="true"
  >
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item label="轮播图">
        <choose-image v-model="form.banners" :limit="9"></choose-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import ChooseImage from "~/components/chooseImage.vue";
import { readGoods, setGoodsBanner } from "~/api/goods";
import { messageInfo } from "../../../ligos-/src/tools/messagePopup";
//设置弹框显示隐藏
const dialogVisible = ref(false);

const form = reactive({
  banners: [],
});

//打开抽屉的方法
const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.bannersLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.banners = res.goodsBanner.map((o) => o.url);
      dialogVisible.value = true;
    })
    .finally(() => {
      row.bannersLoading = false;
    });
};
const emit = defineEmits(["reloadData"]);
const loading = ref(false);
//提交数据的方法
const submit = () => {
  loading.value = true;
  setGoodsBanner(goodsId.value, form)
    .then((res) => {
      messageInfo("设置轮播图成功");
      dialogVisible.value = false;
      emit("reloadData");
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  open,
  submit,
});
</script>

<style scoped></style>
