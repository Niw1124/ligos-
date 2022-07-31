<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" st class="leftLogin">
      <div>
        <div class="welcome">欢迎光临</div>
        <div class="describe">这里是ligo的vue3+vite商城项目</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="rightLogin">
      <h2>欢迎回来</h2>
      <div class="usenameAndPassword">
        <span class="hrLine"></span>
        <span>账号密码登录</span>
        <span class="hrLine"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="loginForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="onSubmit"
        class="loginBtn"
        round
        color="#626aef"
        :loading="loading"
        >登录</el-button
      >
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { messageInfo } from "../../tools/messagePopup";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
//通过userStore创建一个store（这里的store指的是导入整体的store from ~/store/index）的实例
const store = useStore();
// do not use same name with ref
const form = reactive({
  username: "",
  password: "",
});
const formRef = ref(null); //让formRef变成响应式的
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { message: "请输入3-5位用户名长度", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      message: "密码至少包含 数字和英文，长度6-20",
      trigger: "blur",
    },
  ],
};
//这里是为了设置按钮不能重复点击
const loading = ref(false);
const onSubmit = () => {
  //验证表单form的校验是否通过
  formRef.value.validate((valid) => {
    // console.log(valid);
    if (!valid) {
      return false;
    }
    loading.value = true;
    store
      .dispatch("login", form)
      .then((res) => {
        messageInfo("登录成功");
        router.push("/");
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
// 回车即可登录 监听键盘事件
//监听回车事件的函数
function onKeyUp(e) {
  if (e.key === "Enter") {
    onSubmit();
  }
}
//添加键盘监听
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});
//移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style scoped>
.login-container {
  @apply bg-indigo-500 min-h-screen;
}
.leftLogin,
.rightLogin {
  @apply flex items-center justify-center;
}
.rightLogin {
  @apply bg-light-50 flex-col;
}
.welcome {
  @apply text-5xl text-light-50 mb-4 font-bold;
}
.describe {
  @apply text-gray-200;
}
.usenameAndPassword {
  @apply flex items-center justify-center my-5 text-gray-500;
}
.hrLine {
  @apply h-[1px] w-16 bg-gray-200 mx-4;
}
.loginForm {
  @apply w-[250px];
}
.loginBtn {
  @apply w-[250px];
}
.rightLogin h2 {
  @apply mb-4;
}
.rightLogin div span {
  border: 1px;
}
</style>
