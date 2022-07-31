<template>
  <template v-if="modelValue">
    <el-image
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-3"
    ></el-image>
  </template>
  <div class="choose_image_btn" @click="open">
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <el-container class="bg-white rounded" style="height: 70vh">
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
        <image-main
          openChoose="true"
          ref="ImageMainRef"
          @choose="handleChoose"
        ></image-main>
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/layout/ImageAside.vue";
import ImageMain from "~/components/layout/ImageMain.vue";
const dialogVisible = ref(false);
//点击头像后打开关闭图库的方法
const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

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

const props = defineProps({ modelValue: [String, Array] });
const emit = defineEmits(["update:modelValue"]);
let urls = [];
const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};
//点击确认后出发submit事件
const submit = () => {
  if (urls.length) {
    emit("update:modelValue", urls[0]);
  }
  close();
};
</script>

<style scoped>
.choose_image_btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-200);
}
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
