<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <el-menu
      :default-active="defaultActive"
      class="border-0"
      @select="handleSelect"
      :collapse="isCollapse"
      :collapse-transition="false"
      unique-opened
    >
      <template v-for="(item, index) in asideMenus" :key="index">
        <!-- v-if判断是否有下级菜单 -->
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <!-- 动态图标 -->
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(item2, index2) in item.child"
            :key="index2"
            :index="item2.frontpath"
          >
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 一级菜单和前面的不同条件 -->
        <!-- 这里的index如果是一级菜单的话直接就是item.frontpath -->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();
const asideMenus = computed(() => store.state.menus);
//默认选中当前路径
const defaultActive = ref(route.path);
//监听路由变化
onBeforeRouteUpdate((to, from) => {
  defaultActive.value = to.path;
});
const handleSelect = (e) => {
  // e对应的就是path路径
  router.push(e);
};
//是否折叠也可以用计算属性
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));
</script>

<style scoped>
.f-menu {
  transition: all 0.4s;
  top: 64px;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md;
}

.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
