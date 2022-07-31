<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <aside-list
        v-for="(item, index) in list"
        :key="index"
        :active="activeId == item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
        >{{ item.name }}</aside-list
      >
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>
  <form-component
    ref="FormComponentRef"
    :title="drawerTitle"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number
          v-model="form.order"
          :min="1"
          :max="1000"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
  </form-component>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import AsideList from "./AsideList.vue";
import {
  getImageClassList,
  createImageClass,
  changeImageClass,
  deleteImageClass,
} from "~/api/image-class";
import FormComponent from "../formComponent.vue";
import { messageInfo } from "~/tools/messagePopup";
import { computedEager } from "@vueuse/core";
const num = ref(0);

//加载动画
const loading = ref(false);
const list = ref([]);

//分页部分
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const editId = ref(0);
const drawerTitle = computed(() => {
  editId.value ? "修改" : "新增";
});
//获取数据
function getData(p = null) {
  //p是点击下一页后的页数
  if (typeof p == "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getImageClassList(currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list;
      let item = list.value[0];
      if (item) {
        // activeId.value = item.id;
        // 因为每次都要重新给activeId赋值，直接调用handleChangeActiveId函数即可
        //这样获取完图库列表之后就可以自动获取第一个分类下面的图片列表
        handleChangeActiveId(item.id);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

const FormComponentRef = ref(null);
const handleCreate = () => {
  editId.value = 0;
  //要先清空form的数据
  form.name = "";
  form.order = 50;
  //打开它的方法
  FormComponentRef.value.open();
};
//选中图库分类ID
const activeId = ref(0);
//传递给父组件
const emit = defineEmits(["change"]);
//切换分类方法
function handleChangeActiveId(id) {
  activeId.value = id;
  //每次调用都要把change传过去，同时把id传过去
  emit("change", id);
}
defineExpose({
  //因为是点击头部然后改变侧边栏的表单所以我们把handleCreate暴露出去
  handleCreate,
});

const form = reactive({
  name: "",
  order: 50,
});

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: blur,
    },
  ],
};

const formRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    //如果valid为false
    if (!valid) {
      return;
    }
    FormComponentRef.value.showLoading();
    const fun = editId.value
      ? changeImageClass(editId.value, form)
      : createImageClass(form);
    fun
      .then((res) => {
        messageInfo(drawerTitle.value + "成功");
        //新增成功后重新获取第一页数据
        getData(editId.value ? currentPage.value : 1);
        FormComponentRef.value.close();
      })
      .finally(() => {
        FormComponentRef.value.hideLoading();
      });
  });
};

//触发编辑图库分类的方法
const handleEdit = (row) => {
  editId.value = row.id;
  form.name = row.name;
  form.order = row.order;
  FormComponentRef.value.open();
};
//删除图库分类的办法
const handleDelete = (id) => {
  loading.value = true;
  deleteImageClass(id)
    .then((res) => {
      messageInfo("删除成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
