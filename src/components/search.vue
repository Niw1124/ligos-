<template>
  <el-form :model="model" label-width="80px" class="mb-3">
    <el-row :gutter="20">
      <slot></slot>
      <!-- 如果showSearch为true就显示 -->
      <template v-if="showSearch">
        <slot name="show"> </slot>
      </template>

      <!-- 按钮部分不用变动 -->
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="emit('search')">搜索</el-button>
          <el-button @click="emit('reset')">重置</el-button>
          <el-button
            type="primary"
            text
            @click="changeShowSearch"
            v-if="hasShowSearch"
            >{{ showSearch ? "收起" : "展开" }}
            <el-icon
              ><ArrowUpBold v-if="showSearch" /><ArrowDownBold v-else
            /></el-icon>
          </el-button></div
      ></el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from "vue";

defineProps({
  model: Object,
});
//重置和搜索两个功能需要定义一下暴露出去
const emit = defineEmits(["search", "reset"]);

//展开收起的辅助判断
const showSearch = ref(false);
const changeShowSearch = () => {
  showSearch.value = !showSearch.value;
};

const slot = useSlots();
//如果show插槽有值则hasShowSearch为true
const hasShowSearch = ref(!!slot.show);

console.log(slot.show);
</script>

<style scoped></style>
