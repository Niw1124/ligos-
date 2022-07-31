<template>
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-4"><Dish /></el-icon>
      ligos商城
    </span>

    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <Fold v-if="$store.state.asideWidth == '250px'" />
      <Expand v-else
    /></el-icon>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh"
        ><RefreshRight
      /></el-icon>
    </el-tooltip>
    <!-- margin-left:auto能使元素靠右显示 主要是因为元素的width和margin-left以外都是0，所以最终 div 会靠近包含块的右边 -->
    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle"
          ><FullScreen v-if="!isFullscreen" /><Aim v-if="isFullscreen" />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <!-- 头像 -->
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="LogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- <el-drawer
    v-model="showdrawer"
    title="修改密码"
    size="40%"
    close-on-click-modal="false"
  >
      <el-button
        type="primary"
        @click="onSubmit"
        class="loginBtn"
        round
        color="#626aef"
        :loading="loading"
        >提交修改</el-button
      >

  </el-drawer> -->
  <form-component
    ref="formDrawerRef"
    title="修改密码"
    destroyOnClose
    @submit="onSubmit"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="form"
      class="loginForm"
      label-width="80px"
      size="small"
    >
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input
          v-model="form.oldpassword"
          placeholder="请输入旧密码"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入新密码"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input
          v-model="form.repassword"
          placeholder="请再次输入新密码"
          show-password
        >
        </el-input>
      </el-form-item>
    </el-form>
  </form-component>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useFullscreen } from "@vueuse/core"; //引入全屏方法
import { useRePassword, useLogout } from "~/tools/useMangers.js";
import FormComponent from "../formComponent.vue";

const store = useStore();
const router = useRouter();
const {
  //是否全屏状态isFullscreen
  isFullscreen,
  //切换全屏
  toggle,
} = useFullscreen();
//执行修改密码
const { formDrawerRef, form, rules, formRef, onSubmit, openRePasswordForm } =
  useRePassword();
const { handleLogOut } = useLogout();
//下拉菜单点击判断
const handleCommand = (c) => {
  switch (c) {
    case "LogOut":
      handleLogOut();
      break;
    case "rePassword":
      //调用抽屉组件的open方法来控制显示隐藏
      openRePasswordForm();
      break;
  }
};

//全屏功能
const handleRefresh = () => {
  location.reload();
};
</script>

<style scoped>
.f-header {
  @apply flex bg-indigo-700 items-center  text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 10000;
}
.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn {
  @apply flex justify-center items-center;
  height: 42px;
  width: 64px;
  cursor: pointer;
}
.icon-btn:hover {
  @apply bg-indigo-600;
}
.f-header,
.dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center;
}
.dropdown {
  @apply mx-5;
}
</style>
