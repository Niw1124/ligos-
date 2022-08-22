<template>
  <div></div>
  <router-link to="Index"></router-link>
  <router-link to="About"></router-link>
  <router-view></router-view>
</template>

<script>
console.log(import.meta.env);
</script>

<style>
.bar {
  height: 3px !important;
}
.body {
  @apply bg-gray-100;
}
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
/* 滚动条交汇部分 */
::-webkit-scrollbar-corner {
  display: block;
}
/* 滚动条小方块部分 */
::-webkit-slider-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
}
/* 滚动条的横杠 */
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
