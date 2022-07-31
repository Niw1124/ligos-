<template>
  <div class="flex items-center">
    <!-- 判断只有选中的时候才渲染该图标 -->
    <el-icon v-if="modelValue" :size="20" class="mr-2"
      ><component :is="modelValue"></component>
    </el-icon>
    <el-select
      :modelValue="modelValue"
      class="m-2"
      placeholder="请选择菜单图标"
      @change="handleChange"
      filterable="true"
    >
      <!-- <el-input v-model="form.icon"></el-input> -->
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
//把element图标引入进来
import * as iconList from "@element-plus/icons-vue";
//把图标名称赋给icons
const icons = ref(Object.keys(iconList));
defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
const handleChange = (icon) => {
  emit("update:modelValue", icon);
};
</script>

<style scoped></style>
