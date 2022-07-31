<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">{{ title }}</span>
        <!-- type值对应的类型 -->
        <el-tag effect="danger">{{ tip }}</el-tag>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item, index) in btns" :key="index">
        <el-card shadow="hover" class="bg-gray-50 border-0">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl mb-2">{{ item.value }}</span>
            <span class="text-xs text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
defineProps({ title: String, tip: String, btns: Array });
</script>

<style lang="scss" scoped></style>
