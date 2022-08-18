<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key"></el-input
          ><small class="text-gray-500 flex mt-1 ml-1"
            >用于查询物流信息， 接口申请（仅供参考）
          </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { getSysconfig, setSysconfig } from "~/api/sysconfig.js";
import { ref, reactive } from "vue";
import { messageInfo } from "~/tools/messagePopup";

const form = reactive({
  ship: "",
});
const loading = ref(false);
//获取系统配置
function getData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      for (const k in form) {
        //将res中form有的k值赋值给form
        form[k] = res[k];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
const submit = () => {
  loading.value = true;
  //展开form修改 password_encrypt的数据格式
  setSysconfig({
    ...form,
  })
    .then((res) => {
      messageInfo("保存设置成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped></style>
