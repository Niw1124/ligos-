<template>
  <el-form-item label="规格设置">
    <table class="border">
      <thead>
        <!-- 表头的数据 -->
        <tr>
          <th
            class="border"
            v-for="(th, thi) in tableThs"
            :key="thi"
            :width="th.width"
            :rowspan="th.rowspan"
            :colspan="th.colspan"
          >
            {{ th.name }}
          </th>
        </tr>
        <!-- 规格选项的数据 -->
        <tr>
          <th class="border" v-for="(th, thi) in skuLabels" :key="thi">
            {{ th.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- 要渲染的表格数据 -->
        <tr v-for="(item, index) in sku_list" :key="index">
          <td
            width="100"
            class="border text-center"
            v-for="(skus, skusi) in item.skus"
            :key="skusi"
          >
            {{ skus.value }}
          </td>
          <td class="border">
            <el-input
              v-model="item.pprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.oprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.cprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.stock"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.volume"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.weight"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import { initSkuTable } from "~/tools/useSku.js";
const { skuLabels, tableThs, sku_list } = initSkuTable();
console.log(sku_list);
</script>

<style scoped></style>
