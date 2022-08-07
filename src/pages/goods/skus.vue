<template>
  <form-component
    ref="formComponentRef"
    title="设置商品规格"
    @submit="submit"
    destroyOnClose
    size="70%"
  >
    <el-form :model="form">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio label="0"> 单规格 </el-radio>
          <el-radio label="1"> 多规格 </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width: 35%">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width: 35%">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>111 </template>
    </el-form>
  </form-component>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormComponent from "~/components/formComponent.vue";
import { readGoods, updateGoodsSkus } from "~/api/goods";
import { messageInfo } from "~/tools/messagePopup";
//设置弹框显示隐藏
const formComponentRef = ref(null);

const form = reactive({
  sku_type: 0, //规格类型：0单规格1多规格
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  }, //单规格属性（sku_type=0时必填）
});

//打开抽屉的方法
const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.skusLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      console.log(res);
      // 初始化form表单
      form.sku_type = res.sku_type;
      form.sku_value = res.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
      };
      formComponentRef.value.open();
    })
    .finally(() => {
      row.skusLoading = false;
    });
};
const emit = defineEmits(["reloadData"]);
const loading = ref(false);
//提交数据的方法
const submit = () => {
  formComponentRef.value.showLoading();
  updateGoodsSkus(goodsId.value, form)
    .then((res) => {
      messageInfo("设置商品规格成功");
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
