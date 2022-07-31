<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleOpenCreate"
        >新增图片分类
      </el-button>
      <el-button type="warning" size="small" @click="handleUploadFile"
        >上传图片
      </el-button>
    </el-header>
    <el-container>
      <image-aside
        ref="ImageAsideRef"
        @change="handleAsideChange"
      ></image-aside>
      <image-main ref="ImageMainRef"></image-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/layout/ImageAside.vue";
import ImageMain from "~/components/layout/ImageMain.vue";
const windowHeight = window.innerHeight || document.body.clientHeight;
//40是padding的高度
const h = windowHeight - 64 - 44 - 40;
const ImageAsideRef = ref(null);
const handleOpenCreate = () => {
  ImageAsideRef.value.handleCreate();
};
const ImageMainRef = ref(null);
const handleAsideChange = (image_class_id) => {
  ImageMainRef.value.loadData(image_class_id);
};

//点击上传
const handleUploadFile = () => {
  ImageMainRef.value.openUploadFile();
};
</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
