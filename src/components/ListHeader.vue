<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button
        v-if="btns.includes('increment')"
        type="primary"
        size="small"
        @click="emit('increment')"
        >新增</el-button
      >

      <el-popconfirm
        v-if="btns.includes('delete')"
        title="是否批量删除选中记录？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="emit('delete')"
      >
        <template #reference>
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>
      <slot></slot>
    </div>
    <el-tooltip
      v-if="btns.includes('refresh')"
      effect="dark"
      content="刷新数据"
      placement="top"
      ><el-button type="text" @click="emit('refresh')"
        ><el-icon :size="20"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  layout: {
    type: String,
    default: "increment,refresh",
  },
});
// const btns = ref([]);
const btns = computed(() =>
  //将layout的值转换为数组
  {
    return props.layout.split(",");
  }
);
const emit = defineEmits(["increment", "refresh", "delete"]);
</script>

<style scoped></style>
