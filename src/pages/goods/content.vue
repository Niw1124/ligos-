<template>
  <form-component
    ref="formComponentRef"
    title="设置商品详情"
    @submit="submit"
    destroyOnClose
  >
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </form-component>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormComponent from "~/components/formComponent.vue";
import Editor from "~/components/Editor.vue";
import { readGoods, updateGoods } from "~/api/goods";
import { messageInfo } from "~/tools/messagePopup";
//设置弹框显示隐藏
const formComponentRef = ref(null);

const form = reactive({
  content: "",
});

//打开抽屉的方法
const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      formComponentRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};
const emit = defineEmits(["reloadData"]);
const loading = ref(false);
//提交数据的方法
const submit = () => {
  formComponentRef.value.showLoading();
  updateGoods(goodsId.value, form)
    .then((res) => {
      messageInfo("设置商品详情成功");
      formComponentRef.value.close();
      emit("reloadData");
    })
    .finally(() => {
      formComponentRef.value.hideLoading();
    });
};

defineExpose({
  open,
  submit,
});
</script>

<style scoped></style>
