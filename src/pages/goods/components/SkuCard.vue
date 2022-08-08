<template>
  <el-form-item label="添加规格">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon><more /></el-icon>
            </template>
          </el-input>
          <div class="ml-auto">
            <el-button
              size="small"
              @click="sortCard('up', index)"
              :disabled="index == 0"
              ><el-icon><Top /></el-icon
            ></el-button>
            <el-button
              size="small"
              @click="sortCard('down', index)"
              :disabled="index == sku_card_list.length - 1"
              ><el-icon><Bottom /></el-icon
            ></el-button>
            <el-popconfirm
              title="你确定要删除该规格选项？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(item)"
            >
              <template #reference>
                <el-button size="small"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <!-- card body --><SkuCardItem :skuCardId="item.id" />
    </el-card>
    <el-button
      type="success"
      size="small"
      @click="createSkuCardEvent"
      :loading="btnLoading"
      >添加规格</el-button
    >
  </el-form-item>
</template>

<script setup>
import SkuCardItem from "./SkuCardItem.vue";
import {
  sku_card_list,
  createSkuCardEvent,
  btnLoading,
  handleUpdate,
  handleDelete,
  sortCard,
} from "~/tools/useSku.js";
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>
