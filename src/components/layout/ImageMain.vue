<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <!-- <div v-for="(item, index) in list" :key="index">
        {{ item.url }}
      </div> -->
      <el-row :gutter="10">
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in list"
          :key="index"
        >
          <el-card
            shadow="hover"
            class="relative mb-3"
            :body-style="{ padding: 0 }"
            :class="{ 'border-blue-500': item.checked }"
          >
            <el-image
              :src="item.url"
              fit="cover"
              class="h-[150px]"
              style="width: 100%"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="flex items-center justify-center">
              <el-checkbox
                v-model="item.checked"
                @change="handleChooseChange(item)"
                v-if="openChoose"
              ></el-checkbox>

              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(item)"
                >重命名</el-button
              >
              <el-popconfirm
                title="你确定要删除该图片？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text class="!m-0"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev,pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>
  <!-- 提交文件 -->
  <el-drawer v-model="drawer" title="上传图片">
    <upload-file
      :data="{ image_class_id }"
      @success="handleUploadSuccess"
    ></upload-file>
  </el-drawer>
</template>

<script setup>
import { computed, ref } from "vue";
import { getImageList, changeImageName, deleteImage } from "~/api/image.js";
import { popUpInputBox } from "~/tools/useMessageBox.js";
import UploadFile from "~/components/uploadFile.vue";
import { messageInfo } from "~/tools/messagePopup.js";
//上传图片
const drawer = ref(false);
const openUploadFile = () => {
  drawer.value = true;
};
//定义分页部分的响应式数据
//总条目数
const total = ref(0);
//每页显示个数
const limit = ref(10);
//定义拿到的数组
const list = ref([]);
//定义当前页数
const currentPage = ref(1);
//定义loading数据
const loading = ref(false);

//定义当前图库id
const image_class_id = ref(0);
function getData(p = null) {
  //p是点击下一页后的页数
  if (typeof p == "number") {
    currentPage.value = p;
  }
  loading.value = true;
  //第一个参数是传当前图库id，第二个参数是传当前页数
  getImageList(image_class_id.value, currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list.map((o) => {
        o.checked = false;
        return o;
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
//根据分类id重新加载图片列表
const loadData = (id) => {
  currentPage.value = 1;
  image_class_id.value = id;
  getData();
};

//上传成功
const handleUploadSuccess = () => {
  getData(1);
};

//选中的图片
const emit = defineEmits(["choose"]);
const checkedImage = computed(() => list.value.filter((o) => o.checked));

const handleChooseChange = (item) => {
  if (item.checked && checkedImage.value.length > 1) {
    item.checked = false;
    return messageInfo("最多只能选中一张", "warning");
  }
  emit("choose", checkedImage.value);
};

defineExpose({
  loadData,
  openUploadFile,
});

//重命名的方法
const handleEdit = (item) => {
  popUpInputBox("重命名", item.name).then(({ value }) => {
    loading.value = true;
    changeImageName(item.id, value)
      .then((res) => {
        messageInfo("修改成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
//删除的方法
const handleDelete = (id) => {
  loading.value = true;
  deleteImage([id])
    .then((res) => {
      messageInfo("删除成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
//
defineProps({
  openChoose: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-main .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-gray-800 bg-opacity-50 px-2 py-1;
}
.el-image-viewer__close {
  top: 80px;
}
</style>
